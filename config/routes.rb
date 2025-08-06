Rails.application.routes.draw do
  root "home#index"

  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for "User", at: "auth"
      resources :user_roles, only: [ :create, :update, :destroy ]
      resources :denied_accesses, only: [] do
        collection do
          patch :toggle_visibility  # For toggling visibility (hidden)
        end
      end
      resources :users
      resources :areas, only: [ :index, :create, :update, :patch, :destroy ]
    end
  end

  # Let React Router handle all frontend routes
  get "*path", to: "home#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
