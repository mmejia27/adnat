class User < ApplicationRecord
  has_and_belongs_to_many :organizations
  has_many :shifts

  has_secure_password
  validates :name, presence: true
  validates :email_address, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }

  def as_json(options={})
    options[:except] ||= :password_digest
    super
  end
end
