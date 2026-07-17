module Api
  class CustomersController < ApplicationController
    before_action :require_auth

    def index
      render json: { customers: customers_list, summary: summary_data }
    end

    private

    def summary_data
      {
        total: 2_847,
        active: 1_932,
        new_this_month: 128,
        churned_this_month: 43
      }
    end

    def customers_list
      [
        { id: 1, first_name: "Ava", last_name: "Mitchell", email: "ava.m@northwind.io", phone: "+1-555-0101", plan: "Pro", status: "active", joined: "2025-03-12", revenue: "$2,184" },
        { id: 2, first_name: "Leo", last_name: "Park", email: "leo@brightlab.co", phone: "+1-555-0102", plan: "Team", status: "active", joined: "2025-01-08", revenue: "$5,976" },
        { id: 3, first_name: "Maya", last_name: "Reed", email: "maya@coralstudio.com", phone: "+1-555-0103", plan: "Pro", status: "active", joined: "2025-04-22", revenue: "$1,792" },
        { id: 4, first_name: "Noah", last_name: "Kim", email: "noah@pinevalley.dev", phone: "+1-555-0104", plan: "Starter", status: "inactive", joined: "2025-06-01", revenue: "$343" },
        { id: 5, first_name: "Sofia", last_name: "Cruz", email: "sofia@emberworks.io", phone: "+1-555-0105", plan: "Team", status: "active", joined: "2025-02-15", revenue: "$4,982" },
        { id: 6, first_name: "Ethan", last_name: "Webb", email: "ethan@looplane.co", phone: "+1-555-0106", plan: "Pro", status: "active", joined: "2025-05-30", revenue: "$1,536" },
        { id: 7, first_name: "Isla", last_name: "Chen", email: "isla@stellardesign.co", phone: "+1-555-0107", plan: "Enterprise", status: "active", joined: "2024-11-03", revenue: "$12,600" },
        { id: 8, first_name: "James", last_name: "Harper", email: "james@axiom.dev", phone: "+1-555-0108", plan: "Starter", status: "inactive", joined: "2025-07-19", revenue: "$196" },
        { id: 9, first_name: "Olivia", last_name: "Santos", email: "olivia@peakview.io", phone: "+1-555-0109", plan: "Pro", status: "active", joined: "2025-03-28", revenue: "$2,988" },
        { id: 10, first_name: "Daniel", last_name: "Ward", email: "daniel@coastline.dev", phone: "+1-555-0110", plan: "Team", status: "active", joined: "2024-12-15", revenue: "$7,188" }
      ]
    end
  end
end
