import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class SubscribersService {

  constructor(
    @InjectModel(Subscriber.name) 
    private subscriberModel: SoftDeleteModel<SubscriberDocument> )
  { }

 async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
  const newSubscriber = await this.subscriberModel.create({
    ...createSubscriberDto,
    createdBy:{
      _id: user._id,
      email: user.email
    }
  }) 
  return {
    _id: newSubscriber._id,
    createdAt: newSubscriber.createdAt
  } 
}

 async findAll(currentPage:number, limit:number, qs: string) {
    const { filter, sort ,population } = aqp(qs)
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage -1 ) * limit;
    let defaultLimit = limit ? limit : 10 
    const totalItems = (await this.subscriberModel.find(filter)).length
    const totalPage = Math.ceil(totalItems/defaultLimit)

    const result = await this.subscriberModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .exec()

    return {
      meta: {
        result,
        current: currentPage,
        pageSize: defaultLimit,
        total: totalItems,
        totalPage
      }
    }
  }


 async findOne(id: string) {
    const subscriber = await this.subscriberModel.findById(id)
    if(!subscriber){
      throw new NotFoundException('Not found subscriber')
    }
    return subscriber
  }

 async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
  return await this.subscriberModel.updateOne(
    { email:user.email }, {
    ...updateSubscriberDto,
    updatedBy:{
      _id: user._id,
      email: user.email
    }
  },
  { upsert:true })
  }

  async remove(id: string, user: IUser) {
    const subscriber = await this.subscriberModel.findById(id)
    if(!subscriber){
      throw new NotFoundException('Not found subscriber')
    }
    await this.subscriberModel.updateOne({
      deletedBy:{
        _id: user._id,
        email: user.email
      }
    })
    return await this.subscriberModel.softDelete({_id:id})
  }

  async getSkills(user:IUser){
    const {email} = user
    await this.subscriberModel.findOne({email}, { skills:1}) 

  }
}
