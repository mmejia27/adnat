Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :v1, defaults: { format: 'json' } do

    post '/authentication', to: 'authentication#create'

    resources :organizations do
      post 'membership/:user_id', to: 'organizations#join', on: :member
      delete 'membership/:user_id', to: 'organizations#leave', on: :member

      resources :shifts do
      end
    end

    resources :users do
      resources :organizations, only: [:index] do
        resources :shifts, only: [:index] do
          resources :breaks, only: [:index]
        end
      end
    end

    resources :shifts
    resources :breaks

  end
  get '/session', to: 'sessions#is_authenticated?'
  post '/session', to: 'sessions#create'
  delete '/session', to: 'sessions#destroy'

  root 'home#index'
  get '/*path' => 'home#index', constraints: -> request { request.format == :html }
end
