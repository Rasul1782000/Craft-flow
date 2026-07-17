module Api
  class InvoicesController < ApplicationController
    before_action :require_auth

    def index
      render json: { invoices: invoices_list, summary: summary_data, total: invoices_list.size, page: 1, pages: 1 }
    end

    private

    def summary_data
      {
        total_outstanding: "$31,620",
        paid_this_month: "$25,890",
        overdue: "$3,469",
        pending: "$6,779"
      }
    end

    def invoices_list
      [
        { id: "INV-2025-001", customer: "Ava Mitchell", amount: "$249.00", status: "paid", issued: "2025-07-01", due_date: "2025-07-15" },
        { id: "INV-2025-002", customer: "Leo Park", amount: "$599.00", status: "pending", issued: "2025-07-02", due_date: "2025-07-16" },
        { id: "INV-2025-003", customer: "Maya Reed", amount: "$249.00", status: "paid", issued: "2025-07-05", due_date: "2025-07-19" },
        { id: "INV-2025-004", customer: "Noah Kim", amount: "$49.00", status: "overdue", issued: "2025-06-15", due_date: "2025-06-29" },
        { id: "INV-2025-005", customer: "Sofia Cruz", amount: "$599.00", status: "paid", issued: "2025-07-08", due_date: "2025-07-22" },
        { id: "INV-2025-006", customer: "Ethan Webb", amount: "$249.00", status: "pending", issued: "2025-07-10", due_date: "2025-07-24" },
        { id: "INV-2025-007", customer: "Isla Chen", amount: "$1,050.00", status: "paid", issued: "2025-07-01", due_date: "2025-07-31" },
        { id: "INV-2025-008", customer: "James Harper", amount: "$49.00", status: "overdue", issued: "2025-06-01", due_date: "2025-06-15" },
        { id: "INV-2025-009", customer: "Olivia Santos", amount: "$249.00", status: "paid", issued: "2025-07-03", due_date: "2025-07-17" },
        { id: "INV-2025-010", customer: "Daniel Ward", amount: "$599.00", status: "pending", issued: "2025-07-09", due_date: "2025-07-23" },
        { id: "INV-2025-011", customer: "Ava Mitchell", amount: "$249.00", status: "paid", issued: "2025-06-01", due_date: "2025-06-15" },
        { id: "INV-2025-012", customer: "Leo Park", amount: "$599.00", status: "paid", issued: "2025-06-02", due_date: "2025-06-16" }
      ]
    end
  end
end
