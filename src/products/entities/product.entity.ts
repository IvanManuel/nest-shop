import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '17d48b0f-2226-4f79-afba-62362dba9fd9',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true, 
    })
    title: string;

    @ApiProperty({
        example: 10.99,
        description: 'Product price',
        minimum: 0,
    })
    @Column('float', {
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: 'A comfortable t-shirt with Teslo logo',
        description: 'Product description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't-shirt_teslo',
        description: 'Product Slug - for SEO',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0,
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'L', 'XL'],
        description: 'Product sizes',
        default: [],
        isArray: true,
    })
    @Column('text', {
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender', 
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product, {
        cascade: true,
        eager: true,
    })
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.products,
        { eager: true, }
    )
    user: User;

    @BeforeInsert()
    updateSlugInsert() {

      if( !this.slug ) {
        this.slug = this.title;
      }

      this.slug = this.slug.toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }

}
