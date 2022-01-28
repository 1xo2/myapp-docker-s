//#region 
import { Box, Card, CardContent, CardMedia, Grid, Link, Paper, Typography } from '@material-ui/core'
import Layout from '../components/Layout'
import db from '../backend/db';
import NextLink from 'next/link'
import productModel from '../backend/DBModels/productModel';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useEffect } from 'react';
import { constance } from '../utils/constants';
import ProductCard_Hook from '../components/hooks/ProductCard_Hook';
import campaignModel from '../backend/DBModels/campaignModel';
import Carousel from 'react-material-ui-carousel';
// import cache from "memory-cache";
// import { setCache } from '../components/helpers/cache_helper';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import StarsIcon from '@material-ui/icons/Stars';
import Image from 'next/image'
import { AddCircleOutline, MonetizationOn } from '@material-ui/icons';

//#endregion

export default function Home(props) {
  const
    { topRatedProducts, newComingProducts, campaigns, TopDollarProducts } = props,
    { dispatch, state: { campaignsSet } } = useContext(Store);


  function CampaignItem2(props) {
    return (
      <NextLink passHref href={props.item.isGlobal ? '/Search_Screen' : '/Search_Screen?campaign=' + props.item.name}>
        <Link>
          <Paper>
            <Grid container className='campaign'>
              <Grid item md={4} xs={12} className='campaignImg'>
                {/* <img src={constance.cloudinaryPath + props.item.image} alt='campaign media' /> */}
                <Image height='220' width='522'
                  src={constance.cloudinaryPath + props.item.image} alt='campaign media' />
              </Grid>
              <Grid item md={8} xs={12} className='campaignTxt' >
                <div>{props.item.name}</div>
                <p>{props.item.description} </p>
                <span> Click It</span>
              </Grid>
            </Grid>


          </Paper>
        </Link>
      </NextLink>
    )
  }

  function getSection(n) {

    let
      url = '/Search_Screen?query=&',
      data, txt, ico;

    if (n === 0) {
      url += 'sort=topRated'
      data = topRatedProducts
      txt = 'Top Rated Products'
      ico = <StarsIcon className='ico-title' />
    }
    else if (n === 1) {
      url += 'sort=newest'
      data = newComingProducts
      txt = 'New Coming'
      ico = <AddCircleOutline className='ico-title' />
    } else {
      url += 'sort=highest'
      data = TopDollarProducts
      txt = 'Top Dollar'
      ico = <MonetizationOn className='ico-title' />
    }


    return (
      <div className="section">

        <NextLink href={url} passHref>
          <Link>
            <Typography component='h1' variant='h3' className='title'>
              {ico}
              {txt}
            </Typography>
          </Link>
        </NextLink>


        <Grid container justifyContent='center'>
          {
            data.map((product) => (
              <ProductCard_Hook product={product} key={product.slug} md={3} />
            ))
          }
        </Grid>
      </div>
    )
  }

  useEffect(() => {
    dispatch({ type: constance.LOADING_OFF })

    // load store campaigns
    if (campaigns && campaignsSet.campaigns.length === 0) {

      dispatch({
        type: constance.campaigns.SET_CAMPAIGNS,
        payload: campaigns
      })
    }

  }, [campaigns, campaignsSet.campaigns.length, dispatch])


  return (
    <Layout
      title='shopping cart:6'
      description='shopping cart with seo, next-js, react, materialUI, cloudinary ...'>

      {campaigns &&
        <Carousel interval={Number(8000)} centerMode={true} centerSlidePercentage={97} >
          {
            // autoPlay={false}
            campaigns.map((item, i) => <CampaignItem2 key={i} item={item} />)
          }
        </Carousel>
      }


      {/* TOP RATED */}
      {getSection(0)}
      
      {/* categorys */}
      <div className="section">
        <Typography variant='h3' component='h2' className='title'>
          <ViewQuiltIcon className='ico-title' />
          Categories XO-1222
        </Typography>

        <Grid container spacing={2}>
          {
            constance.category.map((c) => (
              <Grid item key={c} md={2} xs={6}>

                <NextLink href={'/Search_Screen?category=' + c} passHref
                  onClick={() => {
                    dispatch({ type: constance.LOADING_ON })
                    // router.push(path)
                  }}
                >
                  <Link>

                    <Card key={c}>
                      <Box className='cat-box'>
                        {/* <Image
                          src={`/images/site/${c}.png`}
                          alt="dress"
                          height='85px' width='95px'
                        /> */}
                        <CardMedia
                          component="img"
                          image={`/images/site/${c}.png`}
                          alt={c}
                        />
                        <CardContent>
                          <Typography color="textSecondary" >
                            {c}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>

                  </Link>
                </NextLink>
              </Grid>
            ))
          }
        </Grid>


      </div>

      {/* NEW COMING */}
      {getSection(1)}

      <CampaignItem2 item={{
        isGlobal: true,
        image: '1635187617/cartN6/file_j7jmrm.jpg',
        // image: '1635178760/cartN6/file_i2xza8.png',
        name: 'Braking Deals',
        description: 'We on a Campaign with very good Deal.',
      }} />

      {/* TOP DOLLAR */}
      {getSection(2)}




    </Layout>
  )
}

export async function getStaticProps() {


  await db.connect();
  const
    topRatedProducts = await productModel.find({}, '-reviews')
      .lean()
      .sort({ rating: -1 })
      .limit(4),

    newComingProducts = await productModel.find({}, '-reviews')
      .lean()
      .sort({ createdAt: '-1' })
      .limit(4),

    TopDollarProducts = await productModel.find({}, '-reviews')
      .lean()
      .sort({ price: '-1' })
      .limit(4),

    campaigns = await campaignModel.find({}).lean();
  db.disconnect();

  // setCache('topRatedProducts', topRatedProducts)
  // setCache('newComingProducts', newComingProducts)
  // setCache('newComingProducts', TopDollarProducts)
  // setCache(constance.cache.CAMPAIGNS, campaigns)


  return {
    props:
    {
      topRatedProducts: topRatedProducts.map(db.cocStringify),
      newComingProducts: newComingProducts.map(db.cocStringify),
      TopDollarProducts: TopDollarProducts.map(db.cocStringify),

      campaigns: campaigns.map(db.cocStringify),
    },
    revalidate: 86400,//1 day is 60 * 60 * 24,
  }
}




// export async function getServerSideProps() {

//   // console.log('cache.get(topRatedProducts):', cache.get('topRatedProducts'))

//   if (cache.get('topRatedProducts') &&
//     cache.get('newComingProducts') &&
//     cache.get('TopDollarProducts') &&
//     cache.get(constance.cache.CAMPAIGNS)
//   ) {
//     console.log('get CACHE data ')
//     return {
//       props:
//       {
//         topRatedProducts: cache.get('topRatedProducts').map(db.cocStringify),
//         newComingProducts: cache.get('newComingProducts').map(db.cocStringify),
//         TopDollarProducts: cache.get('TopDollarProducts').map(db.cocStringify),
//         campaigns: cache.get(constance.cache.CAMPAIGNS).map(db.cocStringify),
//       }
//     }
//   } else {
//     console.log('get API data ')
//     await db.connect();
//     const
//       topRatedProducts = await productModel.find({}, '-reviews')
//         .lean()
//         .sort({ rating: -1 })
//         .limit(4),

//       newComingProducts = await productModel.find({}, '-reviews')
//         .lean()
//         .sort({ createdAt: '-1' })
//         .limit(4),

//       TopDollarProducts = await productModel.find({}, '-reviews')
//         .lean()
//         .sort({ price: '-1' })
//         .limit(4),

//       campaigns = await campaignModel.find({}).lean();
//     db.disconnect();

//     setCache('topRatedProducts', topRatedProducts)
//     setCache('newComingProducts', newComingProducts)
//     setCache('newComingProducts', TopDollarProducts)
//     setCache(constance.cache.CAMPAIGNS, campaigns)


//     return {
//       props:
//       {
//         topRatedProducts: topRatedProducts.map(db.cocStringify),
//         newComingProducts: newComingProducts.map(db.cocStringify),
//         TopDollarProducts: TopDollarProducts.map(db.cocStringify),

//         campaigns: campaigns.map(db.cocStringify),
//       }
//     }
//   }
// }