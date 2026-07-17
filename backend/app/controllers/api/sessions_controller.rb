module Api
  class SessionsController < ApplicationController
    include JsonRespondable

    # POST /api/signup
    def signup
      @user = User.new(signup_params)

      if @user.save
        render json: {
          message: "Account created successfully",
          user: {
            id: @user.id,
            email: @user.email,
            first_name: @user.first_name,
            last_name: @user.last_name
          }
        }, status: :created
      else
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # POST /api/login
    def login
      @user = User.find_by(email: params[:email].downcase)

      if @user&.authenticate(params[:password])
        render json: {
          message: "Login successful",
          token: token_for(@user),
          user: {
            id: @user.id,
            email: @user.email,
            first_name: @user.first_name,
            last_name: @user.last_name
          }
        }, status: :ok
      else
        render json: { error: "Invalid email or password" }, status: :unauthorized
      end
    end

    # POST /api/logout
    def logout
      render json: { message: "Logged out successfully" }, status: :ok
    end

    # POST /api/forgot_password
    def forgot_password
      @user = User.find_by(email: params[:email])

      if @user
        # In production, send a reset email here
        render json: { message: "If an account exists with that email, a reset link has been sent" }, status: :ok
      else
        render json: { message: "If an account exists with that email, a reset link has been sent" }, status: :ok
      end
    end

    private

    def signup_params
      params.permit(:email, :first_name, :last_name, :phone, :password, :password_confirmation)
    end
  end
end
