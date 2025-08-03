Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :users
      resources :auth
    end
  end
  
  get '*path', to: 'home#index', via: :all
end
