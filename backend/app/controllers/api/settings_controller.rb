module Api
  class SettingsController < ApplicationController
    before_action :require_auth

    def show
      render json: settings_data
    end

    def update
      if current_user.update(settings_params)
        render json: { success: true, user: current_user }
      else
        render json: { success: false, errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def settings_data
      {
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        email: current_user.email,
        notifications_enabled: current_user.notifications_enabled,
        preferences: {
          theme: "dark",
          language: "en",
          timezone: "UTC",
          email_digest: "weekly"
        },
        team: [
          { name: "Jordan Lee", email: "jordan@superdesign.co", role: "Admin", status: "active" },
          { name: "Sam Rivera", email: "sam@superdesign.co", role: "Editor", status: "active" },
          { name: "Taylor Kim", email: "taylor@superdesign.co", role: "Viewer", status: "pending" }
        ]
      }
    end

    def settings_params
      params.permit(:first_name, :last_name, :email, :notifications_enabled)
    end
  end
end
