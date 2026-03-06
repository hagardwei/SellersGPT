import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('simple', 'media', 'split');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_split_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_split_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_split_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_split_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_split_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_split_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_split_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_stats_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_stats_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_stats_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_stats_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_faq_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_faq_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_faq_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_faq_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_timeline_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_timeline_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_timeline_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_timeline_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_gallery_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_gallery_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_gallery_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_gallery_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_video_video_type" AS ENUM('youtube', 'vimeo', 'selfHosted');
  CREATE TYPE "public"."enum_pages_blocks_video_aspect_ratio" AS ENUM('video', '4/3', 'square');
  CREATE TYPE "public"."enum_pages_blocks_video_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_video_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_video_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_video_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_table_of_contents_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_table_of_contents_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_table_of_contents_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_table_of_contents_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_related_posts_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_related_posts_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_related_posts_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_related_posts_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('simple', 'media', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_split_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_split_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_split_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_split_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_split_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_split_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_split_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_timeline_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_timeline_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_timeline_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_timeline_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_video_video_type" AS ENUM('youtube', 'vimeo', 'selfHosted');
  CREATE TYPE "public"."enum__pages_v_blocks_video_aspect_ratio" AS ENUM('video', '4/3', 'square');
  CREATE TYPE "public"."enum__pages_v_blocks_video_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_video_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_video_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_video_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_related_posts_settings_theme" AS ENUM('light', 'dark', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_related_posts_settings_padding_top" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_related_posts_settings_padding_bottom" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_related_posts_settings_visibility" AS ENUM('both', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_version_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_users_social_accounts_platform" AS ENUM('linkedin', 'facebook', 'twitter');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_ai_jobs_type" AS ENUM('GENERATE_WEBSITE', 'GENERATE_PAGE', 'REGENERATE_PAGE', 'TRANSLATE_DOCUMENT', 'BULK_KEYWORD_GENERATION', 'GENERATE_KEYWORD_ARTICLE', 'AGENT_SYNC', 'INDUSTRY_NEWS_AUTOMATION');
  CREATE TYPE "public"."enum_ai_jobs_status" AS ENUM('pending', 'running', 'completed', 'failed');
  CREATE TYPE "public"."enum_ai_jobs_target_language" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_translations_translations_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_translations_translations_status" AS ENUM('pending', 'translating', 'completed', 'failed');
  CREATE TYPE "public"."enum_translations_source_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_bulk_keyword_uploads_status" AS ENUM('pending', 'processing', 'completed', 'failed');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'converted', 'lost');
  CREATE TYPE "public"."enum_social_posts_platform" AS ENUM('linkedin', 'facebook', 'twitter');
  CREATE TYPE "public"."enum_social_posts_status" AS ENUM('draft', 'scheduled', 'published', 'failed');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_search_language" AS ENUM('en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'newsAutomation', 'weeklySocialDigest', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'newsAutomation', 'weeklySocialDigest', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_website_info_goal" AS ENUM('lead-generation', 'product-showcase', 'company-profile', 'services');
  CREATE TYPE "public"."enum_website_info_brand_tone" AS ENUM('professional', 'corporate', 'friendly', 'technical', 'marketing-heavy');
  CREATE TABLE "pages_blocks_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_variant",
  	"title" varchar,
  	"sub_title" varchar,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"columns" "enum_pages_blocks_feature_grid_columns" DEFAULT '3',
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_feature_grid_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_feature_grid_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_feature_grid_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_feature_grid_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_split_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_split_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"media_position" "enum_pages_blocks_split_media_position" DEFAULT 'right',
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_split_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_split_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_split_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_split_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_testimonials_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_testimonials_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_testimonials_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_testimonials_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_stats_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_stats_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_stats_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_stats_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_logo_cloud_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_logo_cloud_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_logo_cloud_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_logo_cloud_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_faq_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_faq_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_faq_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_faq_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_timeline_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_timeline_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_timeline_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_timeline_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_pages_blocks_gallery_columns" DEFAULT '3',
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_gallery_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_gallery_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_gallery_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_gallery_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"video_type" "enum_pages_blocks_video_video_type" DEFAULT 'youtube',
  	"url" varchar,
  	"thumbnail_id" integer,
  	"aspect_ratio" "enum_pages_blocks_video_aspect_ratio" DEFAULT 'video',
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_video_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_video_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_video_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_video_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_table_of_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'On this page',
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_table_of_contents_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_table_of_contents_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_table_of_contents_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_table_of_contents_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_related_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro_content" jsonb,
  	"limit" numeric DEFAULT 3,
  	"settings_block_id" varchar,
  	"settings_theme" "enum_pages_blocks_related_posts_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum_pages_blocks_related_posts_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum_pages_blocks_related_posts_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum_pages_blocks_related_posts_settings_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"language" "enum_pages_language" DEFAULT 'en',
  	"translation_group_id" varchar,
  	"slug" varchar,
  	"deleted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_variant",
  	"title" varchar,
  	"sub_title" varchar,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"columns" "enum__pages_v_blocks_feature_grid_columns" DEFAULT '3',
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_feature_grid_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_feature_grid_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_feature_grid_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_feature_grid_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_split_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_split_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"media_position" "enum__pages_v_blocks_split_media_position" DEFAULT 'right',
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_split_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_split_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_split_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_split_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_testimonials_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_testimonials_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_testimonials_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_testimonials_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_stats_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_stats_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_stats_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_stats_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_logo_cloud_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_logo_cloud_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_logo_cloud_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_logo_cloud_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_faq_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_faq_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_faq_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_faq_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_timeline_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_timeline_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_timeline_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_timeline_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum__pages_v_blocks_gallery_columns" DEFAULT '3',
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_gallery_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_gallery_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_gallery_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_gallery_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"video_type" "enum__pages_v_blocks_video_video_type" DEFAULT 'youtube',
  	"url" varchar,
  	"thumbnail_id" integer,
  	"aspect_ratio" "enum__pages_v_blocks_video_aspect_ratio" DEFAULT 'video',
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_video_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_video_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_video_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_video_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_of_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'On this page',
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_table_of_contents_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_table_of_contents_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_table_of_contents_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_table_of_contents_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_related_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro_content" jsonb,
  	"limit" numeric DEFAULT 3,
  	"settings_block_id" varchar,
  	"settings_theme" "enum__pages_v_blocks_related_posts_settings_theme" DEFAULT 'light',
  	"settings_padding_top" "enum__pages_v_blocks_related_posts_settings_padding_top" DEFAULT 'medium',
  	"settings_padding_bottom" "enum__pages_v_blocks_related_posts_settings_padding_bottom" DEFAULT 'medium',
  	"settings_visibility" "enum__pages_v_blocks_related_posts_settings_visibility" DEFAULT 'both',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_language" "enum__pages_v_version_language" DEFAULT 'en',
  	"version_translation_group_id" varchar,
  	"version_slug" varchar,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"language" "enum_posts_language" DEFAULT 'en',
  	"translation_group_id" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_language" "enum__posts_v_version_language" DEFAULT 'en',
  	"version_translation_group_id" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"language" "enum_categories_language" DEFAULT 'en' NOT NULL,
  	"translation_group_id" varchar NOT NULL,
  	"slug" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_social_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_users_social_accounts_platform" NOT NULL,
  	"username" varchar,
  	"provider_user_id" varchar,
  	"access_token" varchar,
  	"refresh_token" varchar,
  	"expires_at" timestamp(3) with time zone,
  	"scope" varchar,
  	"is_active" boolean
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum_header_language" DEFAULT 'en' NOT NULL,
  	"translation_group_id" varchar DEFAULT 'header-group' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum_footer_language" DEFAULT 'en' NOT NULL,
  	"translation_group_id" varchar DEFAULT 'footer-group' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "ai_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_ai_jobs_type" NOT NULL,
  	"status" "enum_ai_jobs_status" DEFAULT 'pending' NOT NULL,
  	"step" varchar,
  	"prompt" varchar,
  	"input_payload" jsonb,
  	"output_payload" jsonb,
  	"error" jsonb,
  	"skipped_blocks" jsonb,
  	"retry_count" numeric DEFAULT 0,
  	"review_score" numeric,
  	"review_issues" jsonb,
  	"retry_reason" varchar,
  	"parent_job_id" integer,
  	"target_language" "enum_ai_jobs_target_language",
  	"total_keywords" numeric,
  	"processed_keywords" numeric,
  	"completion_percentage" numeric,
  	"payload" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "translations_translations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_translations_translations_language" NOT NULL,
  	"status" "enum_translations_translations_status" DEFAULT 'pending' NOT NULL,
  	"job_id_id" integer,
  	"error" varchar,
  	"completed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "translations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_group_id" varchar NOT NULL,
  	"source_language" "enum_translations_source_language" DEFAULT 'en' NOT NULL,
  	"source_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bulk_keyword_uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"file_name" varchar,
  	"status" "enum_bulk_keyword_uploads_status" DEFAULT 'pending',
  	"total_keywords" numeric,
  	"processed_keywords" numeric DEFAULT 0,
  	"parent_job_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"need" varchar,
  	"message" varchar,
  	"source_url" varchar,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"transcript" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_raw" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar NOT NULL,
  	"external_id" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"content" varchar,
  	"url" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"fetched_at" timestamp(3) with time zone NOT NULL,
  	"processed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL,
  	"platform" "enum_social_posts_platform" NOT NULL,
  	"status" "enum_social_posts_status" DEFAULT 'draft' NOT NULL,
  	"scheduled_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"external_id" varchar,
  	"error" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"pages_id" integer,
  	"news_raw_id" integer
  );
  
  CREATE TABLE "news_sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_id" varchar,
  	"source_url" varchar,
  	"title" varchar,
  	"content" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"slug" varchar,
  	"language" "enum_search_language",
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer,
  	"header_id" integer,
  	"footer_id" integer,
  	"ai_jobs_id" integer,
  	"translations_id" integer,
  	"bulk_keyword_uploads_id" integer,
  	"leads_id" integer,
  	"news_raw_id" integer,
  	"social_posts_id" integer,
  	"news_sources_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"search_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "website_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"website_name" varchar NOT NULL,
  	"industry" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"goal" "enum_website_info_goal" NOT NULL,
  	"reference_website" varchar,
  	"target_audience" varchar NOT NULL,
  	"services" varchar NOT NULL,
  	"brand_tone" "enum_website_info_brand_tone" NOT NULL,
  	"is_completed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "chatbot_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"welcome_message" varchar DEFAULT 'Hello! How can I help you today',
  	"calendly_link" varchar,
  	"email_notifications" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "industry_news_settings_search_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"query" varchar NOT NULL
  );
  
  CREATE TABLE "industry_news_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"api_tube_key" varchar,
  	"daily_cap" numeric DEFAULT 100,
  	"target_category_id" integer,
  	"similarity_threshold" numeric DEFAULT 0.85,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_links" ADD CONSTRAINT "pages_blocks_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud" ADD CONSTRAINT "pages_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_questions" ADD CONSTRAINT "pages_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_steps" ADD CONSTRAINT "pages_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_of_contents" ADD CONSTRAINT "pages_blocks_table_of_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_posts" ADD CONSTRAINT "pages_blocks_related_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD CONSTRAINT "_pages_v_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_links" ADD CONSTRAINT "_pages_v_blocks_split_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_questions" ADD CONSTRAINT "_pages_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_steps" ADD CONSTRAINT "_pages_v_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_of_contents" ADD CONSTRAINT "_pages_v_blocks_table_of_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_related_posts" ADD CONSTRAINT "_pages_v_blocks_related_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_social_accounts" ADD CONSTRAINT "users_social_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ai_jobs" ADD CONSTRAINT "ai_jobs_parent_job_id_ai_jobs_id_fk" FOREIGN KEY ("parent_job_id") REFERENCES "public"."ai_jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "translations_translations" ADD CONSTRAINT "translations_translations_job_id_id_ai_jobs_id_fk" FOREIGN KEY ("job_id_id") REFERENCES "public"."ai_jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "translations_translations" ADD CONSTRAINT "translations_translations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bulk_keyword_uploads" ADD CONSTRAINT "bulk_keyword_uploads_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_posts_rels" ADD CONSTRAINT "social_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_posts_rels" ADD CONSTRAINT "social_posts_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_posts_rels" ADD CONSTRAINT "social_posts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_posts_rels" ADD CONSTRAINT "social_posts_rels_news_raw_fk" FOREIGN KEY ("news_raw_id") REFERENCES "public"."news_raw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_header_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_jobs_fk" FOREIGN KEY ("ai_jobs_id") REFERENCES "public"."ai_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_translations_fk" FOREIGN KEY ("translations_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bulk_keyword_uploads_fk" FOREIGN KEY ("bulk_keyword_uploads_id") REFERENCES "public"."bulk_keyword_uploads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_raw_fk" FOREIGN KEY ("news_raw_id") REFERENCES "public"."news_raw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_posts_fk" FOREIGN KEY ("social_posts_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_sources_fk" FOREIGN KEY ("news_sources_id") REFERENCES "public"."news_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_news_settings_search_queries" ADD CONSTRAINT "industry_news_settings_search_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industry_news_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_news_settings" ADD CONSTRAINT "industry_news_settings_target_category_id_categories_id_fk" FOREIGN KEY ("target_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_links_order_idx" ON "pages_blocks_hero_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_links_parent_id_idx" ON "pages_blocks_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_media_idx" ON "pages_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_feature_grid_items_order_idx" ON "pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_items_parent_id_idx" ON "pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_items_icon_idx" ON "pages_blocks_feature_grid_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_links_order_idx" ON "pages_blocks_split_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_links_parent_id_idx" ON "pages_blocks_split_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_order_idx" ON "pages_blocks_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_parent_id_idx" ON "pages_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_path_idx" ON "pages_blocks_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_media_idx" ON "pages_blocks_split" USING btree ("media_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_image_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("image_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_cloud_logos_order_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_logos_parent_id_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_logos_logo_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_cloud_order_idx" ON "pages_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_parent_id_idx" ON "pages_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_path_idx" ON "pages_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_questions_order_idx" ON "pages_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_questions_parent_id_idx" ON "pages_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_steps_order_idx" ON "pages_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_steps_parent_id_idx" ON "pages_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_thumbnail_idx" ON "pages_blocks_video" USING btree ("thumbnail_id");
  CREATE INDEX "pages_blocks_table_of_contents_order_idx" ON "pages_blocks_table_of_contents" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_of_contents_parent_id_idx" ON "pages_blocks_table_of_contents" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_of_contents_path_idx" ON "pages_blocks_table_of_contents" USING btree ("_path");
  CREATE INDEX "pages_blocks_related_posts_order_idx" ON "pages_blocks_related_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_related_posts_parent_id_idx" ON "pages_blocks_related_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_posts_path_idx" ON "pages_blocks_related_posts" USING btree ("_path");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_blocks_hero_links_order_idx" ON "_pages_v_blocks_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_links_parent_id_idx" ON "_pages_v_blocks_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_media_idx" ON "_pages_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_order_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_parent_id_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_icon_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_order_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_parent_id_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_path_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_links_order_idx" ON "_pages_v_blocks_split_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_links_parent_id_idx" ON "_pages_v_blocks_split_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_order_idx" ON "_pages_v_blocks_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_parent_id_idx" ON "_pages_v_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_path_idx" ON "_pages_v_blocks_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_media_idx" ON "_pages_v_blocks_split" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_image_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_order_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_parent_id_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_logo_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_order_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_parent_id_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_path_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_questions_order_idx" ON "_pages_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_questions_parent_id_idx" ON "_pages_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_steps_order_idx" ON "_pages_v_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_steps_parent_id_idx" ON "_pages_v_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_image_idx" ON "_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_thumbnail_idx" ON "_pages_v_blocks_video" USING btree ("thumbnail_id");
  CREATE INDEX "_pages_v_blocks_table_of_contents_order_idx" ON "_pages_v_blocks_table_of_contents" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_of_contents_parent_id_idx" ON "_pages_v_blocks_table_of_contents" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_of_contents_path_idx" ON "_pages_v_blocks_table_of_contents" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_related_posts_order_idx" ON "_pages_v_blocks_related_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_related_posts_parent_id_idx" ON "_pages_v_blocks_related_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_related_posts_path_idx" ON "_pages_v_blocks_related_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "users_social_accounts_order_idx" ON "users_social_accounts" USING btree ("_order");
  CREATE INDEX "users_social_accounts_parent_id_idx" ON "users_social_accounts" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_language_idx" ON "header" USING btree ("language");
  CREATE INDEX "header_updated_at_idx" ON "header" USING btree ("updated_at");
  CREATE INDEX "header_created_at_idx" ON "header" USING btree ("created_at");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_language_idx" ON "footer" USING btree ("language");
  CREATE INDEX "footer_updated_at_idx" ON "footer" USING btree ("updated_at");
  CREATE INDEX "footer_created_at_idx" ON "footer" USING btree ("created_at");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "ai_jobs_parent_job_idx" ON "ai_jobs" USING btree ("parent_job_id");
  CREATE INDEX "ai_jobs_updated_at_idx" ON "ai_jobs" USING btree ("updated_at");
  CREATE INDEX "ai_jobs_created_at_idx" ON "ai_jobs" USING btree ("created_at");
  CREATE INDEX "translations_translations_order_idx" ON "translations_translations" USING btree ("_order");
  CREATE INDEX "translations_translations_parent_id_idx" ON "translations_translations" USING btree ("_parent_id");
  CREATE INDEX "translations_translations_job_id_idx" ON "translations_translations" USING btree ("job_id_id");
  CREATE UNIQUE INDEX "translations_translation_group_id_idx" ON "translations" USING btree ("translation_group_id");
  CREATE INDEX "translations_updated_at_idx" ON "translations" USING btree ("updated_at");
  CREATE INDEX "translations_created_at_idx" ON "translations" USING btree ("created_at");
  CREATE INDEX "bulk_keyword_uploads_file_idx" ON "bulk_keyword_uploads" USING btree ("file_id");
  CREATE INDEX "bulk_keyword_uploads_updated_at_idx" ON "bulk_keyword_uploads" USING btree ("updated_at");
  CREATE INDEX "bulk_keyword_uploads_created_at_idx" ON "bulk_keyword_uploads" USING btree ("created_at");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_raw_external_id_idx" ON "news_raw" USING btree ("external_id");
  CREATE INDEX "news_raw_updated_at_idx" ON "news_raw" USING btree ("updated_at");
  CREATE INDEX "news_raw_created_at_idx" ON "news_raw" USING btree ("created_at");
  CREATE INDEX "social_posts_updated_at_idx" ON "social_posts" USING btree ("updated_at");
  CREATE INDEX "social_posts_created_at_idx" ON "social_posts" USING btree ("created_at");
  CREATE INDEX "social_posts_rels_order_idx" ON "social_posts_rels" USING btree ("order");
  CREATE INDEX "social_posts_rels_parent_idx" ON "social_posts_rels" USING btree ("parent_id");
  CREATE INDEX "social_posts_rels_path_idx" ON "social_posts_rels" USING btree ("path");
  CREATE INDEX "social_posts_rels_media_id_idx" ON "social_posts_rels" USING btree ("media_id");
  CREATE INDEX "social_posts_rels_pages_id_idx" ON "social_posts_rels" USING btree ("pages_id");
  CREATE INDEX "social_posts_rels_news_raw_id_idx" ON "social_posts_rels" USING btree ("news_raw_id");
  CREATE UNIQUE INDEX "news_sources_source_id_idx" ON "news_sources" USING btree ("source_id");
  CREATE UNIQUE INDEX "news_sources_source_url_idx" ON "news_sources" USING btree ("source_url");
  CREATE INDEX "news_sources_updated_at_idx" ON "news_sources" USING btree ("updated_at");
  CREATE INDEX "news_sources_created_at_idx" ON "news_sources" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_language_idx" ON "search" USING btree ("language");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_header_id_idx" ON "payload_locked_documents_rels" USING btree ("header_id");
  CREATE INDEX "payload_locked_documents_rels_footer_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_id");
  CREATE INDEX "payload_locked_documents_rels_ai_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_jobs_id");
  CREATE INDEX "payload_locked_documents_rels_translations_id_idx" ON "payload_locked_documents_rels" USING btree ("translations_id");
  CREATE INDEX "payload_locked_documents_rels_bulk_keyword_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("bulk_keyword_uploads_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_news_raw_id_idx" ON "payload_locked_documents_rels" USING btree ("news_raw_id");
  CREATE INDEX "payload_locked_documents_rels_social_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("social_posts_id");
  CREATE INDEX "payload_locked_documents_rels_news_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("news_sources_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "industry_news_settings_search_queries_order_idx" ON "industry_news_settings_search_queries" USING btree ("_order");
  CREATE INDEX "industry_news_settings_search_queries_parent_id_idx" ON "industry_news_settings_search_queries" USING btree ("_parent_id");
  CREATE INDEX "industry_news_settings_target_category_idx" ON "industry_news_settings" USING btree ("target_category_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_links" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_split_links" CASCADE;
  DROP TABLE "pages_blocks_split" CASCADE;
  DROP TABLE "pages_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud" CASCADE;
  DROP TABLE "pages_blocks_faq_questions" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_timeline_steps" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_table_of_contents" CASCADE;
  DROP TABLE "pages_blocks_related_posts" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_split_links" CASCADE;
  DROP TABLE "_pages_v_blocks_split" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_table_of_contents" CASCADE;
  DROP TABLE "_pages_v_blocks_related_posts" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users_social_accounts" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "ai_jobs" CASCADE;
  DROP TABLE "translations_translations" CASCADE;
  DROP TABLE "translations" CASCADE;
  DROP TABLE "bulk_keyword_uploads" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "news_raw" CASCADE;
  DROP TABLE "social_posts" CASCADE;
  DROP TABLE "social_posts_rels" CASCADE;
  DROP TABLE "news_sources" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "website_info" CASCADE;
  DROP TABLE "chatbot_settings" CASCADE;
  DROP TABLE "industry_news_settings_search_queries" CASCADE;
  DROP TABLE "industry_news_settings" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_hero_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_split_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_split_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_split_media_position";
  DROP TYPE "public"."enum_pages_blocks_split_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_split_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_split_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_split_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_stats_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_stats_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_stats_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_stats_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_faq_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_faq_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_faq_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_faq_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_timeline_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_timeline_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_timeline_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_timeline_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_gallery_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_gallery_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_gallery_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_gallery_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_video_video_type";
  DROP TYPE "public"."enum_pages_blocks_video_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_video_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_video_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_video_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_video_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_table_of_contents_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_table_of_contents_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_table_of_contents_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_table_of_contents_settings_visibility";
  DROP TYPE "public"."enum_pages_blocks_related_posts_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_related_posts_settings_padding_top";
  DROP TYPE "public"."enum_pages_blocks_related_posts_settings_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_related_posts_settings_visibility";
  DROP TYPE "public"."enum_pages_language";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_split_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_split_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_split_media_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_split_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_split_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_split_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_stats_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_stats_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_stats_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_stats_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_faq_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_faq_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_faq_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_faq_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_timeline_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_timeline_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_timeline_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_timeline_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_video_video_type";
  DROP TYPE "public"."enum__pages_v_blocks_video_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_video_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_video_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_video_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_video_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_table_of_contents_settings_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_related_posts_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_related_posts_settings_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_related_posts_settings_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_related_posts_settings_visibility";
  DROP TYPE "public"."enum__pages_v_version_language";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_language";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_language";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_categories_language";
  DROP TYPE "public"."enum_users_social_accounts_platform";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_language";
  DROP TYPE "public"."enum_footer_nav_items_link_type";
  DROP TYPE "public"."enum_footer_language";
  DROP TYPE "public"."enum_ai_jobs_type";
  DROP TYPE "public"."enum_ai_jobs_status";
  DROP TYPE "public"."enum_ai_jobs_target_language";
  DROP TYPE "public"."enum_translations_translations_language";
  DROP TYPE "public"."enum_translations_translations_status";
  DROP TYPE "public"."enum_translations_source_language";
  DROP TYPE "public"."enum_bulk_keyword_uploads_status";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_social_posts_platform";
  DROP TYPE "public"."enum_social_posts_status";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_search_language";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_website_info_goal";
  DROP TYPE "public"."enum_website_info_brand_tone";`)
}
