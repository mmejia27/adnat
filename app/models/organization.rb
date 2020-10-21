class Organization < ApplicationRecord
  has_and_belongs_to_many :users
  has_many :shifts

  validates :name, presence: true
end
