<?php
  
namespace App\Http\Controllers;
   
use App\Models\Post;
use Illuminate\Http\Request;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;


class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      
    
     return Post::select('id', 'firstname', 'lastname', 'description', 'image')->get();
        
    }
     
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
 
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * @var Illuminate\Filesystem\FilesystemAdapter 
     */
    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
            'description' => 'required',
        ]);


        try{
            $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('post/image', $request->image,$imageName);
            Post::create($request->post()+['image'=>$imageName]);

         
            return response()->json(['succes, Post has been created successfull']);
        }catch(\Exception $e){
         
            return response()->json([
                'message'=>'Something goes wrong while creating a post!!'
            ],500);
        }

                       
    }
     
    /**
     * Display the specified resource.
     *
     * @param  \App\model\post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
return response()->json(['post' => $post]);
      
    } 
     
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\post  $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        return response()->json(['post' => $post]);
        
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post, $id)
    {
        $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
            'description' => 'nullable',
            'image' => 'nullable',
        ]);

        
        
        try{
            
            $post = Post::find($id);
        $post->fill($request->post())->update();

        if($request->hasFile('image')){

            // remove old image
            if($post->image){
                $exists = Storage::disk('public')->exists("post/image/{$post->image}");
                if($exists){
                    Storage::disk('public')->delete("post/image/{$post->image}");
                }
            }

            $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('post/image', $request->image,$imageName);
            $post->image = $imageName;
            $post->save();
        }

        return response()->json([
            'message'=>'Product Updated Successfully!!'
        ]);
    
    
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Something goes wrong while updating a post!!'
            ],500);
        }
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        try {

            if($post->image){
                $exists = Storage::disk('public')->exists("post/image/{$post->image}");
                if($exists){
                    Storage::disk('public')->delete("post/image/{$post->image}");
                }
            }

            $post->delete();

            response()->json([
                'message'=>'Post Deleted Successfully!!'
            ]);
            return redirect('/')->with('success','Post has been deleted successfully');
            
        } catch (\Exception $e) {
         
            return response()->json([
                'message'=>'Something goes wrong while deleting a post!!'
            ]);
        }
    }
 
}