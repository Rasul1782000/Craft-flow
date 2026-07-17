Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    # Auth endpoints
    post "signup",            to: "sessions#signup"
    post "login",             to: "sessions#login"
    post "forgot_password",   to: "sessions#forgot_password"
    post "logout",            to: "sessions#logout"

    # Content page endpoints
    get "home",           to: "pages#home"
    get "product",        to: "pages#product"
    get "library",        to: "pages#library"
    get "pricing",        to: "pages#pricing"
    get "docs",           to: "pages#docs"
    get "perspectives",   to: "pages#perspectives"
    get "expertise",      to: "pages#expertise"
    get "selected-works", to: "pages#selected_works"

    resource :dashboard, only: [:show]
    get "revenue",    to: "revenue#show"
    get "customers",  to: "customers#index"
    get "invoices",   to: "invoices#index"
    get "settings",   to: "settings#show"
    patch "settings", to: "settings#update"
    get "help",       to: "help#show"

    resources :properties do
      collection do
        get :featured
        get :for_sale
        get :for_rent
      end
    end
    resources :users
  end
end
