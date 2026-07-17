require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true
  config.force_ssl = true
  config.asset_host = nil
  config.active_support.deprecation = :notify
  config.log_level = :info
  config.active_support.report_deprecations = false
  config.active_record.dump_schema_after_migration = false
end
