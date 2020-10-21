class Break < ApplicationRecord
  belongs_to :shift
  
  validates :length, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
