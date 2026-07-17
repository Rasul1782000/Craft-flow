module Api
  class DashboardsController < ApplicationController
    before_action :require_auth

    def show
      render json: dashboard_data
    end

    private

    def dashboard_data
      {
        user: {
          first_name: current_user.first_name,
          last_name: current_user.last_name,
          email: current_user.email,
          initials: current_user.name_initials
        },
        kpis: [
          { label: "Active users", value: "12,847", delta: 8.4, positive: true, icon: "users", spark: [30, 28, 34, 36, 33, 40, 44, 42, 48, 52, 55, 60] },
          { label: "Conversion rate", value: "3.94%", delta: 0.8, positive: true, icon: "conversion", spark: [50, 52, 49, 47, 50, 46, 44, 45, 42, 40, 41, 38] },
          { label: "Avg. session", value: "4m 32s", delta: 6.1, positive: true, icon: "cart", spark: [22, 25, 24, 27, 26, 29, 31, 30, 33, 32, 35, 37] },
          { label: "API uptime", value: "99.98%", delta: 0.02, positive: false, icon: "uptime", spark: [20, 24, 22, 30, 34, 31, 40, 44, 48, 52, 58, 64] },
          { label: "Bounce rate", value: "32.1%", delta: 2.4, positive: false, icon: "bounce", spark: [12, 14, 18, 24, 30, 34, 28, 22, 18, 14, 10, 8] },
          { label: "Page views", value: "284.7k", delta: 18.3, positive: true, icon: "views", spark: [34, 30, 26, 18, 4, 10, 20, 30, 40, 50, 56, 60] },
          { label: "New users", value: "8,421", delta: 12.7, positive: true, icon: "newusers", spark: [32, 28, 22, 14, 6, 14, 24, 34, 44, 52, 58, 62] },
          { label: "Sessions", value: "45,892", delta: 9.2, positive: true, icon: "sessions", spark: [30, 26, 20, 12, 6, 14, 26, 38, 48, 56, 60, 64] }
        ],
        revenue: {
          this_year: [42, 48, 45, 56, 61, 67, 74, 71, 82, 90, 96, 104],
          last_year: [33, 38, 41, 43, 49, 51, 57, 59, 64, 67, 70, 76],
          months: %w[Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec]
        },
        traffic: [
          { label: "Organic", percent: 48, color: "#f2521b" },
          { label: "Referral", percent: 27, color: "#ef8f2a" },
          { label: "Social", percent: 15, color: "#fb7185" },
          { label: "Direct", percent: 10, color: "#d9a066" }
        ],
        transactions: [
          { name: "Ava Thompson", email: "ava.t@brightlabs.io", initials: "AT", color: "#f2521b", plan: "Pro", date: "Jul 12", status: "Completed", amount: "$249.00" },
          { name: "Liam Carter", email: "liam.c@northwind.co", initials: "LC", color: "#ef8f2a", plan: "Team", date: "Jul 12", status: "Processing", amount: "$599.00" },
          { name: "Sofia Reyes", email: "sofia@meridian.design", initials: "SR", color: "#fb7185", plan: "Pro", date: "Jul 11", status: "Completed", amount: "$249.00" },
          { name: "Noah Patel", email: "noah.p@vertex.app", initials: "NP", color: "#d9a066", plan: "Starter", date: "Jul 11", status: "Pending", amount: "$49.00" },
          { name: "Mia Nguyen", email: "mia@finch.studio", initials: "MN", color: "#f2521b", plan: "Team", date: "Jul 10", status: "Completed", amount: "$599.00" },
          { name: "Ethan Brooks", email: "ethan.b@loop.dev", initials: "EB", color: "#ef8f2a", plan: "Pro", date: "Jul 10", status: "Processing", amount: "$249.00" },
          { name: "Isabella Rivera", email: "isabella@peakline.co", initials: "IR", color: "#fb7185", plan: "Enterprise", date: "Jul 9", status: "Completed", amount: "$1,050.00" },
          { name: "Lucas Kim", email: "lucas.k@brightlab.co", initials: "LK", color: "#d9a066", plan: "Pro", date: "Jul 9", status: "Completed", amount: "$249.00" }
        ],
        goal: {
          percent: 78,
          current: "$84.2k",
          target: "$108k",
          progress: [
            { label: "New subscriptions", percent: 85 },
            { label: "Expansion revenue", percent: 62 },
            { label: "Retention", percent: 94 }
          ]
        }
      }
    end
  end
end
