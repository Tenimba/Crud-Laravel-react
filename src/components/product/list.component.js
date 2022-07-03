import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2';

export default function List() {


    const [products, setProducts] = useState([]);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState('');
    const [id, setId] = useState('');


    useEffect(()=>{
        fetchProducts() 
    },[])

    const fetchProducts = async () => {
    
        await axios.get(`http://127.0.0.1:8000/posts/`)
        .then(({data})=>{
            setProducts(data)
            console.log(data);
        })
    
    }
    const view = async (id) => {
    
        await axios.get(`http://127.0.0.1:8000/posts/${id}`)
        .then(({data})=>{
            setFirstname(data.post.firstname);
            setLastname(data.post.lastname);
            setDescription(data.post.description);
            setImage(data.post.image);
            setId(data.post.id);

        })
    }

    const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }

          await axios.delete(`http://localhost:8000/posts/${id}`)
          .then(({data})=>{
            
            console.log({data})
            
            Swal.fire({
              icon:"error",
              text:data.message
            })
            fetchProducts()
            navigator.reload()
          }).catch(({response})=>{
              Swal.fire({
                text:response,
                 
                icon:"success"
              })
              fetchProducts()

            
          })
        }
      
 
    return (

      <div className='flex' >
<meta name="csrf-token" content="{{ csrf_token() }}" />
          <div className='tw-relative tw-top-5 tw-left-60' >

             <div> 
             <div className="tw-flex md:tw-row ">
  <ul >
    <li>
      <a  className="tw-nav-link tw-block tw-font-medium tw-text-xs tw-rounded-lg tw-border-b-4 tw-border-l-4 tw-leading-tight tw-uppercase tw-border-x-0 tw-border-t-4 tw-px-4 tw-py-3 tw-my-2 tw-hover:border-transparent tw-hover:bg-white tw-focus:bg-white tw-active"  >
    {
      products.map((product)=>{
        return(
        <li className=' tw-active:bg-white tw-nav tw-nav-tabs tw-flex tw-flex-col tw-flex-wrap tw-list-none tw-border-b-2 tw-bg-gray-300 tw-border-l-2 tw-text-black tw-border-t-2 tw-pl-0 tw-mr-2 tw-active:bg-violet-700' onClick={()=>view(product.id)}>{product.firstname} {product.lastname}</li>
        );
      }
      )
    }
    </a>
    </li>
  </ul>
 <div class="tw-mt-5 tw-text-sm tw-leading-6 tw-text-slate-600 tw-dark:text-slate-400">
      <div className='tw-inline-block tw-absolute'>
                <Link className='tw-bg-cyan-300 tw-absolute tw-top-96 tw-right-64' to={"/posts/create"}>
                    Profile Browser
                </Link>
      <button onClick={()=>deleteProduct(id)} className="tw-text-cyan-700 tw-absolute tw-top-96 tw-left-96">Delete</button>
      <Link className=' tw-absolute tw-top-96 tw-left-0 tw-text-red-700' to={`/posts/edit/${id}`}>
                     Edit 
                </Link>
                </div>
    </div>
 
 <div className='tw-text-sm tw-leading-7 tw-relative md:tw-top-10 tw-left-1/6 tw-text-slate-900 tw-dark:text-white tw-font-semibold tw-select-none'>   
 <img width="50px" src={`http://localhost:8000/storage/post/image/${image}`} />
  <p>{firstname}  {lastname}</p>
      <p className='tw-overscroll-auto tw-overflow-y-scroll tw-p-1 tw-w-96 tw-h-48'>{description}</p>
     
 </div>

</div>
          </div>
      </div>
      </div>
    )
}