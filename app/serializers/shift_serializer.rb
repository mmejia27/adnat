class ShiftSerializer < ActiveModel::Serializer
  has_one :user
  has_many :breaks
  attributes :id, :start, :end
end
