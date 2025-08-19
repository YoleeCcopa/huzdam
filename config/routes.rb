Rails.application.routes.draw do
  root "home#index"

  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        registrations: "api/v1/auth/registrations",
        sessions: "api/v1/auth/sessions"
      }
      devise_scope :user do
        get "magic_login", to: "auth/sessions#magic_login"
      end

      resources :user_roles, only: [ :create, :update, :destroy ]

      resources :denied_accesses, only: [] do
        collection do
          patch :toggle_visibility
        end
      end

      resources :users
      resources :areas,      only: [ :index, :create, :show, :update, :destroy ]
      resources :shelves,    only: [ :index, :create, :show, :update, :destroy ]
      resources :containers, only: [ :index, :create, :show, :update, :destroy ]
      resources :items,      only: [ :index, :create, :show, :update, :destroy ]
    end
  end

  get "*path", to: "home#index", constraints: ->(req) {
    !req.xhr? && req.format.html? && !req.path.starts_with?("/api")
  }
end
