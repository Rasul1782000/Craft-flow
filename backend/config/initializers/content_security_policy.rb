# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.font_src    :self, :https
    policy.img_src     :self, :https, :data
    policy.object_src  :none
    policy.script_src  :self, :https
    policy.style_src   :self, :https
    policy.connect_src :self, :http, :https
    policy.frame_ancestors :none
    policy.base_uri    :self
    policy.form_action :self
  end

  # Generate session nonces for permitted inline scripts and styles.
  config.content_security_policy_nonce_directives = %w(script-src style-src)

  # Report violations without enforcing the policy during initial rollout.
  config.content_security_policy_report_only = Rails.env.production?
end
