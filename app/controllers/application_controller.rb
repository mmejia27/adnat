class ApplicationController < ActionController::Base
  include Response
  include TokenAuthentication

  skip_before_action :verify_authenticity_token
end
