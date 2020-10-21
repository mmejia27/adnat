if Rails.env === 'production' 
  Rails.application.config.session_store :cookie_store, key: '_adnat_production', domain: 'adnat.com'
else
  Rails.application.config.session_store :cookie_store, key: '_adnat_development' 
end
