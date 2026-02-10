import { getPayload } from 'payload'
import crypto from 'crypto'
import configPromise from '@payload-config'
import { AiJob } from '@/payload-types'
import { planWebsiteStructure } from './planner'
import { buildPageContent, PageContent } from './pageBuilder'
import { postProcessLayout } from './postProcessor'
import { reviewContent, ReviewResult } from './reviewer'
import { WebsiteInfo, Page } from '@/payload-types'
import { buildPageSEO } from './seoBuilder'
import { translateContent } from './translator'


 const MAX_REVIEW_RETRIES = 2
 const MIN_REVIEW_SCORE = 70

//  Main Netry Point for running an AI job.
//  This should be called by the triggering endpoint or a backgrounf worker.

export const runAIJob = async (jobId: string | number): Promise<void> => {
  const payload = await getPayload({config: configPromise})

  let job: AiJob | null = null

  try{
    // 1. Fetch the job
    job = (await payload.findByID({
      collection: 'ai-jobs',
      id: jobId,
    })) as AiJob 
    console.log("job statussssssss: ", job)
    if (!job) throw new Error('AI job not found')

    // // 2. Mark as running
    // await payload.update({
    //   collection: 'ai-jobs',
    //   id: jobId,
    //   data: {
    //     status: 'running',
    //     step: 'INITIALIZATION',
    //   },
    // })

    // console.log((`[AI Orchestrator] Statring JOb ${jobId} of type ${job.type}`))

    //2. Route to specific handler
    switch(job.type) {
      case 'GENERATE_WEBSITE': {
        const websiteInfo = (await payload.findGlobal({ slug: 'website-info'})) as unknown as WebsiteInfo

        await payload.update({
          collection: 'ai-jobs',
          id: jobId,
          data: {step: 'PLANNING'},
        })

        const { data: plan, prompt } = await planWebsiteStructure(websiteInfo)

        if(!plan) throw new Error('AI failed to generate a website plan')

        await payload.update({
          collection: 'ai-jobs',
          id: jobId,
          data: {
            output_payload: plan as any,
            prompt: prompt,
            step: 'SPAWNING_PAGES',
          } as any,
        })

        console.log(`[AI Orchestrator] Website plan created with ${plan.pages.length} pages`)

        const allPlannedSlugs = plan.pages.map((p: any) => p.slug)
        for(const p of plan.pages) {
          console.log(`[AI Orchestrator] Creating child job for page ${p.slug}`)

          if (!job.id) {
            throw new Error('Parent job has no id — cannot create child job')
          }

          const childJob = await payload.create({
            collection: 'ai-jobs',
            data: {
              type: 'GENERATE_PAGE',
              status: 'pending',
              parent_job: job.id,
              input_payload: {
                slug: p.slug,
                title: p.title,
                blocks: p.blocks,
                allPlannedSlugs: allPlannedSlugs,
              },
            },
          })
          console.log(`[AI Orchestrator] Child job created with ID: ${childJob.id}`)
          console.log(`[AI Orchestrator] Running Child job for page: ${p.slug}`)
          
          await runAIJob(childJob.id)
        }

        await payload.update({
          collection: 'ai-jobs',
          id: jobId,
          data: {
            status: 'completed',
            step: 'COMPLETED',
            completed_at: new Date().toISOString(),
          }
        })
        break
      }

      case 'GENERATE_PAGE': {
        const websiteInfo = (await payload.findGlobal({slug: 'website-info'})) as unknown as WebsiteInfo
        const input = job.input_payload as any
        const currentRetryCount = (job as any).retry_count || 0
        
        if(!input || !input.slug) throw new Error('Invalud page input payload.')

          console.log(`[AI Orchestrator] Starting page generation for ${input.slug} (attempt ${currentRetryCount + 1})`)
          console.log('Input payload: ', JSON.stringify(input, null, 2))

          await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {step: 'GENERATING_CONTENT'},
          })

          const {data: pageData, prompt } = await buildPageContent(input, websiteInfo)

          if(!pageData) throw new Error('AI failed to generate page content.')

            await payload.update({
              collection: 'ai-jobs',
              id: jobId,
              data: {
                prompt: prompt,
                output_payload: {ai_output: pageData as any},
              } as any,
            })

            // REVIEWING_CONTENT Step
            await payload.update({
              collection: 'ai-jobs',
              id: jobId,
              data: {step: 'REVIEWING_CONTENT'},
            })

            console.log(`[AI Orchestrator] Reviewing content for ${input.slug}`)

            // const reviewResult = await reviewContent(pageData, {
            //   pageTitle: input.title || input.slug,
            //   pageSlug: input.slug,
            //   brandTone: websiteInfo.brandTone || 'professional',
            //   industry: websiteInfo.industry || 'general',
            //   skipAIReview: currentRetryCount > 0,
            // })

            //Store review results

            // await payload.update({
            //   collection: 'ai-jobs',
            //   id: jobId,
            //   data: {
            //     review_score: reviewResult.score,
            //     review_issues: {
            //       seoIssues: reviewResult.seoIssues,
            //       contentIssues: reviewResult.contentIssues,
            //       suggestions: reviewResult.suggestions,
            //     },
            //   } as any,
            // })
        // console.log(`[AI Orchestrator] Review score: ${reviewResult.score}, Approved: ${reviewResult.approved}`)

        //Check if we need to retry due to low score
        // if(!reviewResult.approved && currentRetryCount < MAX_REVIEW_RETRIES){
        //   console.log(`[AI Orchestrator] Score below ${MIN_REVIEW_SCORE}, triggering retry (${currentRetryCount + 1}/${MAX_REVIEW_RETRIES})`)

        //   await payload.update({
        //     collection: 'ai-jobs',
        //     id: jobId,
        //     data: {
        //       status: 'pending',
        //       step: 'PENDING_RETRY',
        //       retry_count: currentRetryCount + 1,
        //       retry_reason: `Review score ${reviewResult.score} below threshold ${MIN_REVIEW_SCORE}`,
        //     } as any,
        //   })

        //   //recursive retry
        //   return runAIJob(jobId)
        // }

        // END REVIEW STEP

        const {processedLayout, validationErrors } = await postProcessLayout(pageData.layout,payload)
        console.log(`Processed Layout length: ${processedLayout.length}`)
         if (processedLayout.length > 0) {
          console.log('First block snippet:', JSON.stringify(processedLayout[0], null, 2))
        } else {
          console.warn('[AI Orchestrator] Processed layout is empty! All blocks may have failed validation.')
        }

        await payload.update({
          collection: 'ai-jobs',
          id: jobId,
          data: {
            step: 'CREATING_DOCUMENT',
            skipped_blocks: validationErrors as any,
          },
        })

        if (processedLayout.length === 0) {
          throw new Error('All generated blocks failed validation. No page created.')
        }

        let pageIdToUpdate: string | number | null = null
        console.log(`[AI Orchestrator] Checking if page exists with slug="${input.slug}"`)
        
        /* ───────────── SEO GENERATION ───────────── */

        const seo = await buildPageSEO(
          input,
          websiteInfo,
          processedLayout,
          // reviewResult = {'approved'},
          // { skipAI: currentRetryCount > 0 }
        )
        // Check if page already exists by slug
        const existingPages = await payload.find({
          collection: 'pages',
          where: {
            slug: { equals: input.slug },
          },
          limit: 1,
        })
        console.log('[AI Orchestrator] Existing pages result:', JSON.stringify(existingPages, null, 2))
        
        if (existingPages.docs.length > 0) {
          pageIdToUpdate = existingPages.docs[0].id
          console.log(`[AI Orchestrator] Page already exists: ID=${pageIdToUpdate}, slug=${input.slug}. Switching to update mode.`)
        }

        let resultPage
        try {
            // Ensure all blocks have _uuid
          const normalizedLayout = processedLayout
            .filter(Boolean) // remove undefined/null blocks
            .map((block: any, index: number) => {
              if (!block.blockType) {
                console.warn(
                  `[AI Orchestrator] Dropping block at index ${index} — missing blockType`
                )
                return null
              }

              return {
                ...block,
              }
            })
            .filter(Boolean)

          const pageDataToSave = {
            title: input.title,
            slug: input.slug,
            layout: normalizedLayout,
            meta: seo?.meta,
            _status: 'published',
            language: 'en',
            publishedAt: new Date().toISOString(),
          }
          console.log('[AI Orchestrator] Final page data to save:', JSON.stringify(pageDataToSave, null, 2))

          if (pageIdToUpdate) {
            // Update existing page
            console.log(`[AI Orchestrator] Updating page ID=${pageIdToUpdate} with data:`, JSON.stringify(pageDataToSave, null, 2))
            resultPage = await payload.update({
              collection: 'pages',
              id: pageIdToUpdate,
              data: pageDataToSave as any,
            })
          } else {
            // Create new page
            const creationData = {
              ...pageDataToSave,
              translation_group_id: crypto.randomUUID(),
            }
            console.log(`[AI Orchestrator] Creating page with data:`, JSON.stringify(creationData, null, 2))
            resultPage = await payload.create({
              collection: 'pages',
              data: creationData as any,
              context: {
                aiJob: true,
              },
            })
          }
           console.log(`[AI Orchestrator] Page saved successfully: ID=${resultPage.id}, slug=${input.slug}`)
        } catch (saveError: any) {
          console.error(`[AI Orchestrator] Failed to save page "${input.slug}":`)
          console.error('Error message:', saveError.message)
          console.error('Full error object:', JSON.stringify(saveError, Object.getOwnPropertyNames(saveError), 2))
          if (processedLayout && processedLayout.length > 0) {
            console.error('[AI Orchestrator] Problematic Layout Snippet (First Block):', JSON.stringify(processedLayout[0], null, 2))
          }
          throw saveError
        }

        if(resultPage) {
          await payload.update({
            collection : 'ai-jobs',
            id: jobId,
            data: {
              status: 'completed',
              step: 'COMPLETED',
              // output_payload: {ai_output: pageData as any, pageId: resultPage.id, reviewScore: reviewResult.score, seo},
              output_payload: {ai_output: pageData as any, pageId: resultPage.id, seo},
              completed_at: new Date().toISOString(),
            },
          })
        }

        break        
      }

      case 'REGENERATE_PAGE': {
        const websiteInfo = (await payload.findGlobal({slug: 'website-info'})) as unknown as WebsiteInfo
        const input = job.input_payload as any
        if(!input || !input.pageId) throw new Error('Invalid regeneration input (missing pageId).')

          await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {step: 'GENERATING_CONTENT'},
          })

          const allPages = await payload.find({
            collection: 'pages',
            limit: 100,
            select: {slug: true},
          })
          const allPlannedSlugs = allPages.docs.map((p: any) => p.slug)
          const enrichedInput = {...input, allPlannedSlugs}

          const {data: pageData, prompt } = await buildPageContent(enrichedInput, websiteInfo)
          if (!pageData) throw new Error('AI failed to generate page content.')
          
          await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {prompt},
          }) 

          // === REVIEWING_CONTENT step ===
          await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {step: 'REVIEWING_CONTENT'},
          })
        console.log(`[AI Orchestrator] Reviewing regenerated content for page: ${input.slug}`)
        const reviewResult = await reviewContent(pageData, {
          pageTitle: input.title || input.slug,
          pageSlug: input.slug,
          brandTone: websiteInfo.brandTone || 'professional',
          industry: websiteInfo.industry || 'general',
          skipAIReview: true, // Skip expensive AI review for regeneration
        })

          // Store review results
        await payload.update({
          collection: 'ai-jobs',
          id: jobId,
          data: {
            review_score: reviewResult.score,
            review_issues: {
              seoIssues: reviewResult.seoIssues,
              contentIssues: reviewResult.contentIssues,
              suggestions: reviewResult.suggestions,
            },
          } as any,
        })

        console.log(`[AI Orchestrator] Regeneration review score: ${reviewResult.score}`)
        // === END REVIEW STEP ===

        const { processedLayout, validationErrors } = await postProcessLayout(pageData.layout, payload)

        const seo = await buildPageSEO(
          input,
          websiteInfo,
          processedLayout,
          reviewResult,
        )

        await payload.update({
          collection: 'ai-jobs',
          id: jobId,
          data: {
            step: 'CREATING_DOCUMENT',
            skipped_blocks: validationErrors as any,
          },
        })

        if(processedLayout.length === 0){
          throw new Error('All generated blocks failed validation. Page update skipped.')
        }

        try{
          await payload.update({
            collection: 'pages',
            id: input.pageId,
            data: { layout: processedLayout, ...(seo ? { meta: seo.meta } : {}) } as any
          })
          console.log(`[AI Orchestrator] Page ID ${input.pageId} updated successfully`)
        } catch (updateError: any){
          console.error(`[AI Orchestrator] Failed to update page ID ${input.pageId}:`)
          console.error('Full error object:', JSON.stringify(updateError, Object.getOwnPropertyNames(updateError), 2))
          console.error('[AI Orchestrator] Problematic Layout Snippet (First Block):', JSON.stringify(processedLayout[0], null, 2))
          throw updateError
        }

        await payload.update({
          collection: 'ai-jobs',
          id: jobId,
          data: {
            status: 'completed',
            step: 'COMPLETED',
            completed_at: new Date().toISOString(),
          },
        })
        break
      }

      case 'TRANSLATE_DOCUMENT' : {
        const input = job.input_payload as any;
        if(!input.sourceDocId) throw new Error('Invalid translation input.');

        //Fetch source document
        const sourceDoc = await payload.findByID({
          collection: input.collection,
          id: input.sourceDocId,
        });

        if(!sourceDoc) throw new Error('Source document not found');
            //run translation
            const { data: translatedContent } = await translateContent(
              sourceDoc as any,
              job.target_language,
              'en'
            );

            // Clone layout to avoid mutating cached translations
            const layoutToProcess = JSON.parse(JSON.stringify(translatedContent.layout));
            console.log(layoutToProcess, "********************")
            //Post Process layout
            const { processedLayout, validationErrors } = await postProcessLayout(layoutToProcess, payload);

            if(processedLayout.length === 0) {
              throw new Error('All translated blocks failed validation. Page creation skipped.');
            }

            //Check if tranaslated page already exists
            const translatedSlug = `${sourceDoc.slug}`;
            const existingPages = await payload.find({
              collection: 'pages',
              where: {
                and: [
                  {
                    slug: {
                      equals: translatedSlug,
                    },
                  },
                  {
                    id: {
                      not_equals: sourceDoc.id,
                    },
                  },
                ],
              },
              limit: 1,
            });
            
            const pageIdToUpdate = existingPages.docs.length ? existingPages.docs[0].id : null;
            console.log(pageIdToUpdate, "pageIdToUpdateeeeeeeee")
            // Build SEO for translated page
            const websiteInfo = (await payload.findGlobal({slug: 'website-info'})) as WebsiteInfo;
            const seo = await buildPageSEO(
              { title: sourceDoc.title, slug: translatedSlug },
              websiteInfo,
              processedLayout,
              {score: 100, approved: true, seoIssues: [], contentIssues: [], suggestions: []}
            );
            
            if (!job.target_language) {
              throw new Error('target_language is required');
            }

            // Create or update translated page 
            let resultPage;
            const finalData = {
              title: sourceDoc.title,
              slug: translatedSlug,
              layout: processedLayout,
              meta: seo.meta,
              language: job.target_language,
              publishedAt: new Date().toISOString(),
            };

            if(pageIdToUpdate){
              resultPage = await payload.update({
                collection: 'pages',
                id: pageIdToUpdate,
                data: finalData
              });
            } else {
              resultPage = await payload.create({
                collection: 'pages',
                data: {
                  ...finalData,
                  meta: {
                    ...seo.meta,
                    image: sourceDoc.meta?.image ?? undefined,
                  },
                  translation_group_id: sourceDoc.translation_group_id,
                  _status: 'published',
                },
                context: { aiJob: true, translating: true } 
              });
            }
            // Update translation in tracking table
            const tracking = await payload.find({
              collection: 'translations',
              where: { translation_group_id: { equals: sourceDoc.translation_group_id } },
              limit: 1,
            });

            if(tracking.docs.length > 0) {
              const targetLang = job?.target_language;
              const translations = tracking.docs[0].translations?.map((t: any) => {
                // Strip ID from the translation object itself
                const { id, ...rest } = t;
                return {
                  ...rest,
                  status: (t.language === targetLang) ? 'completed' : t.status,
                  content: (t.language === targetLang) ? translatedContent : t.content,
                };
              });


              await payload.update({
                collection: 'translations',
                id: tracking.docs[0].id,
                data: { translations },
              });
            }

            

            //Mark job completed
            await payload.update({
              collection: 'ai-jobs',
              id: jobId,
              data: {
                status: 'completed',
                step: 'COMPLETED',
                output_payload: translatedContent,
                // prompt,
              }
            });

          console.log(`[AI Orchestrator] Translation completed for ${job.target_language}`);
          break;
      }
      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }
  } catch (error: any) {
    console.error(`[AI Orchestrator] Job ${jobId} failed. Job object:`, job)
    console.error('Error message:', error.message)
    console.error('Stack trace:', error.stack)

    await payload.update({
      collection: 'ai-jobs',
      id: jobId,
      data: {
        status: 'failed',
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
    })

    if(job && job.parent_job){
      const parentId = typeof job.parent_job === 'object' ? job.parent_job.id : job.parent_job
      if (parentId) {
        await payload.update({
          collection: 'ai-jobs',
          id: parentId,
          data: {
            status: 'failed',
            error: {
              message: `Child job ${jobId} failed: ${error.message}`,
              stack: error.stack,
            },
          },
        })
      }
    }
  }
}