module Api
  class PropertiesController < ApplicationController
    include JsonRespondable

    before_action :require_auth, except: [ :index, :show, :featured, :for_sale, :for_rent ]
    before_action :set_property, only: [ :show, :update, :destroy ]

    def index
      @properties = Property.page(params[:page]).per(params[:per_page] || 25)
      render json: @properties
    end

    def show
      render json: @property
    end

    def create
      @property = Property.new(property_params)

      if @property.save
        render json: @property, status: :created
      else
        record_invalid @property
      end
    end

    def update
      if @property.update(property_params)
        render json: @property
      else
        record_invalid @property
      end
    end

    def destroy
      @property.destroy
      head :no_content
    end

    def featured
      @properties = Property.featured.limit(params[:limit] || 10)
      render json: @properties
    end

    def for_sale
      @properties = Property.for_sale.page(params[:page]).per(params[:per_page] || 25)
      render json: @properties
    end

    def for_rent
      @properties = Property.for_rent.page(params[:page]).per(params[:per_page] || 25)
      render json: @properties
    end

    private

    def set_property
      @property = Property.find(params[:id])
    end

    def property_params
      params.require(:property).permit(
        :title,
        :description,
        :price,
        :address,
        :city,
        :state,
        :zip_code,
        :bedrooms,
        :bathrooms,
        :square_feet,
        :property_type,
        :status,
        :featured,
        :image_url,
        :agent_name,
        :agent_phone,
        :agent_email
      )
    end
  end
end
