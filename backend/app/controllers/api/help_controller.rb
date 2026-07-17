module Api
  class HelpController < ApplicationController
    def show
      render json: help_data
    end

    private

    def help_data
      {
        categories: [
          {
            name: "Getting Started",
            icon: "rocket",
            articles: [
              { title: "Setting up your workspace", views: 12_840, content: "Learn how to configure your workspace settings, invite team members, and customize your dashboard layout." },
              { title: "Inviting team members", views: 8_231, content: "Step-by-step guide to adding collaborators, assigning roles, and managing team permissions." },
              { title: "Understanding the dashboard", views: 6_702, content: "A complete walkthrough of every widget, metric, and chart available on your main dashboard." }
            ]
          },
          {
            name: "Billing & Plans",
            icon: "credit-card",
            articles: [
              { title: "Managing your subscription", views: 9_456, content: "How to upgrade, downgrade, or cancel your plan at any time without hidden fees." },
              { title: "Invoice and payment history", views: 5_893, content: "Access past invoices, update payment methods, and download billing statements." },
              { title: "Upgrading your plan", views: 4_217, content: "Compare plan features side-by-side and learn what changes when you upgrade." }
            ]
          },
          {
            name: "Account Management",
            icon: "user",
            articles: [
              { title: "Changing your password", views: 7_124, content: "Update your credentials and enable two-factor authentication for added security." },
              { title: "Configuring notifications", views: 3_876, content: "Choose which alerts you receive and how — email, in-app, or Slack integration." },
              { title: "Data export and privacy", views: 2_543, content: "Export your data at any time and review our privacy and retention policies." }
            ]
          },
          {
            name: "Integrations",
            icon: "plugs",
            articles: [
              { title: "Connecting to Slack", views: 5_678, content: "Receive real-time notifications and commands directly in your Slack workspace." },
              { title: "GitHub integration guide", views: 4_932, content: "Sync repositories, track issues, and automate deployments from your dashboard." },
              { title: "API documentation", views: 3_401, content: "Full reference for the REST API including authentication, rate limits, and endpoints." }
            ]
          }
        ],
        support: {
          email: "support@craftflow.io",
          response_time: "Within 4 hours",
          status: "All systems operational"
        }
      }
    end
  end
end
