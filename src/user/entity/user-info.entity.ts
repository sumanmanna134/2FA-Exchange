import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserInfo extends BaseEntity {
  constructor() {
    // Call the super() constructor from BaseEntity
    super();
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pet_name', type: 'varchar', nullable: true })
  petName: string;

  @Column({ type: 'varchar', nullable: true })
  photo: string;

  @Column({ type: 'varchar', nullable: true })
  modified_photo: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;
}
