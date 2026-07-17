module Api
  class RevenueController < ApplicationController
    before_action :require_auth

    def show
      render json: revenue_data
    end

    private

    def revenue_data
      {
        monthly_recurring: 42_180,
        annual_recurring: 506_160,
        churn_rate: 3.2,
        lifetime_value: 2_840,
        monthly_trend: [
          { month: "Jan", mrr: 34_200, revenue: 34_200 },
          { month: "Feb", mrr: 35_800, revenue: 35_800 },
          { month: "Mar", mrr: 37_100, revenue: 37_100 },
          { month: "Apr", mrr: 38_400, revenue: 38_400 },
          { month: "May", mrr: 39_600, revenue: 39_600 },
          { month: "Jun", mrr: 40_200, revenue: 40_200 },
          { month: "Jul", mrr: 42_180, revenue: 42_180 }
        ],
        plan_breakdown: [
          { plan: "Starter", revenue: 18_200, subscribers: 364 },
          { plan: "Pro", revenue: 31_500, subscribers: 210 },
          { plan: "Team", revenue: 24_800, subscribers: 62 },
          { plan: "Enterprise", revenue: 12_600, subscribers: 14 }
        ]
      }
    end
  end
end
