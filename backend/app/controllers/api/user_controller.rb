module Api
  class UserController < ApplicationController
    include JsonRespondable

    before_action :require_auth
    before_action :set_user, only: [ :show, :update, :destroy ]

    def index
      @users = User.page(params[:page]).per(params[:per_page] || 25)
      render json: @users
    end

    def show
      render json: @user
    end

    def create
      @user = User.new(user_params)

      if @user.save
        render json: @user, status: :created
      else
        record_invalid @user
      end
    end

    def update
      if @user.update(user_params)
        render json: @user
      else
        record_invalid @user
      end
    end

    def destroy
      @user.destroy
      head :no_content
    end

    private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(
        :email,
        :first_name,
        :last_name,
        :phone,
        :password,
        :password_confirmation
      )
    end
  end
end
