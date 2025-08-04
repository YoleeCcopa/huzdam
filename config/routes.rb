Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :users
      mount_devise_token_auth_for 'User', at: 'auth'
    end
  end

  # Let React Router handle all frontend routes
  get '*path', to: 'home#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end