class Shift < ApplicationRecord
  belongs_to :user
  belongs_to :organization
  has_many :breaks, dependent: :delete_all

  validates :start, :end, presence: true

  accepts_nested_attributes_for :breaks
end
