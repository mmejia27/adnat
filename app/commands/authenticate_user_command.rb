class AuthenticateUserCommand < BaseCommand
  private

  attr_reader :email_address, :password

  def initialize(email_address, password)
    @email_address = email_address
    @password = password
  end

  def user
    @user ||= User.find_by(email_address: email_address)
  end

  def password_valid?
    user && user.authenticate(password)
  end

  def payload
    if password_valid?
      @result = { token: JwtService.encode(contents), user: user }
    else
      errors.add(:base, 'authenticate_user_command.invalid_credentials')
    end
  end

  def contents
    {
      user_id: user.id,
      expiration: 24.hours.from_now.to_i
    }
  end
end