class CreateJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_join_table :organizations, :users do |t|
      t.index [:organization_id, :user_id], unique: true
      t.index [:user_id, :organization_id]
    end
  end
end
