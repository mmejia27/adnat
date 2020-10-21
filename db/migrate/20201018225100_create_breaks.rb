class CreateBreaks < ActiveRecord::Migration[6.0]
  def change
    create_table :breaks do |t|
      t.integer :length
      t.references :shift, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
