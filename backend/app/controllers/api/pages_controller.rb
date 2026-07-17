module Api
  class PagesController < ApplicationController
    include JsonRespondable

    def home
      render json: {
        sections: [
          { id: "hero", title: "CraftFlow. The digital agency." },
          { id: "expertise", title: "We build the digital backbone where your business truly thrives." },
          { id: "works", title: "Transform your digital operations" }
        ]
      }, status: :ok
    end

    def product
      render json: {
        features: [
          { name: "Custom ERP Systems", description: "Tailor-made enterprise resource planning built for your unique workflows." },
          { name: "Custom CRM Platforms", description: "Customer relationship management solutions that align with your sales and support workflows." },
          { name: "Intelligent Dashboards", description: "Real-time dashboards that drive smarter decisions across your organization." },
          { name: "Inventory Management", description: "Intelligent systems that reduce waste and maximize profitability." }
        ]
      }, status: :ok
    end

    def library
      render json: {
        categories: [
          { name: "ERP Guides", description: "In-depth guides on enterprise resource planning and implementation." },
          { name: "CRM Templates", description: "Ready-to-use CRM configuration templates and best practices." },
          { name: "Dashboard Tutorials", description: "Step-by-step tutorials for building powerful business dashboards." }
        ]
      }, status: :ok
    end

    def pricing
      render json: {
        plans: [
          { name: "Starter", price: "Free", description: "For small businesses exploring digital solutions" },
          { name: "Growth", price: "$49/mo", description: "For growing teams needing integrated tools" },
          { name: "Enterprise", price: "Custom", description: "For organizations requiring full-scale digital transformation" }
        ]
      }, status: :ok
    end

    def docs
      render json: {
        sections: [
          { name: "Getting Started", description: "Learn the basics of CraftFlow workspaces and projects." },
          { name: "API Reference", description: "Full REST API endpoint documentation for system integration." },
          { name: "Integration Guide", description: "Deep dive into connecting ERP, CRM, and dashboard systems." },
          { name: "Troubleshooting", description: "Common issues and solutions for your digital stack." }
        ]
      }, status: :ok
    end

    def perspectives
      render json: {
        articles: [
          { title: "The Future of Enterprise Resource Planning", category: "ERP" },
          { title: "Building CRM Systems That Scale", category: "CRM" },
          { title: "Data-Driven Decision Making with Smart Dashboards", category: "Analytics" }
        ]
      }, status: :ok
    end

    def expertise
      render json: {
        services: [
          { name: "ERP Implementation", description: "End-to-end enterprise resource planning tailored to your business." },
          { name: "CRM Development", description: "Custom customer relationship platforms built for lasting connections." },
          { name: "Dashboard & Analytics", description: "Real-time data visualization that powers informed decisions." }
        ]
      }, status: :ok
    end

    def selected_works
      render json: {
        projects: [
          { name: "Project Atlas", description: "Full-scale ERP transformation for a manufacturing enterprise." },
          { name: "Project Helix", description: "Custom CRM platform unifying sales, marketing, and support." },
          { name: "Project Prism", description: "Enterprise dashboard suite connecting 12 data sources." }
        ]
      }, status: :ok
    end
  end
end
