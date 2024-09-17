import mongoose ,{Schema} from "mongoose"
import mongooseAggregatePaginte from "mongoose-aggregate-paginate-v2"



const videoSchema = new Schema({
    videofile:{
        type:String, //claudinary file
        required:true
    },
    thumpnails:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    thumpnails:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.Objectid,
            ref:"User"
        },
},
{
    timestamps:true
})

videoSchema.plugin(mongooseAggregatePaginte)
export const Video = mongoose.model('Video',videoSchema)