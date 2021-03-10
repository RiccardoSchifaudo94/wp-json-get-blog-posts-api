function pagination(id){

		$(".paginator_container .square").removeClass("active");
		$(".paginator_container #"+id).addClass("active");
		$(".cs-blog-post-loader").removeClass("hide");
	
		//alert(id);

		$.ajax({	
			url: ajaxurl,
			type:"POST",
			dataType:"text",
			data:"action=get_posts_via_rest&page="+id, 
			beforeSend:function(){
				$(".cs-blog-post-container").addClass("hide");
			},
		   	success: function(result){
		   		
		   		$(".cs-blog-post-container").html("");
		   		var html = result.slice(0,-1);
		   		$(".cs-blog-post-container").html(html);
		   		$(".cs-blog-post-loader").addClass("hide");
		   		$(".cs-blog-post-container").removeClass("hide");
  			},
			complete:function(){
				$('html, body').animate({
					scrollTop: $(".cs-blog-post-container").offset().top
				}, 0);
			},
			error:function(){
				
			}
  		});
}
search_posts = () => {

	var search_keyword = $(".cs-post-search-bar input").val();

	
	if(search_keyword!=""){
		$("body").prepend('<div class="cs-post-search-modal-post"><h2>$text placholder</h2><i class="fas fa-times" onclick="close_modal();"></i><div class="cs-post-search-results"></div></div>');
		$("body").addClass("hide-overflow");

		$(".cs-post-search-modal-post h2").html("Search for: <div>"+search_keyword+"</div>");	
		$(".cs-post-search-modal-post .cs-post-search-results").html("<div class='cs-blog-post-loader'></div>");

		$.ajax({	
			url: ajaxurl,
			type:"POST",
			dataType:"text",
			data:"action=search_blog_posts_api&keyword="+encodeURI(search_keyword), 
			beforeSend:function(){
		
			},
		   	success: function(result){
		   		
		   		$(".cs-post-search-modal-post .cs-post-search-results .cs-blog-post-loader").remove();

		   		$(".cs-post-search-bar input").val("");
		   		

		   		var resp = JSON.parse(result);

		   		if(resp!=0){
			   		resp.map((post)=>{
			   			var html = "";
			   				html += "<div class='cs-blog-post'>";
			   				html += "<h1>"+post.title+"</h1>";
			   				html += "<strong>"+post.date+"</strong>";
			   				html += "<img src='"+post.image+"' />";
			   				html += "<p>"+post.excerpt+"</p>";
			   				html += "<a href='"+post.link+"' target='_blank'><button>Read More</button></a>";
			   				html += "</div>";
			   				$(".cs-post-search-modal-post .cs-post-search-results").append(html);

			   		});
			   	}
			   	else{
			   		$(".cs-post-search-modal-post .cs-post-search-results").append("<h2>Posts not found!</h2>");
			   		$(".cs-post-search-bar input").val("Insert a valid keyword here!");
			   	}

  			},
			complete:function(){
			
			},
			error:function(){
				
			}
  		});
	}
	else{
		alert("insert a valid keyword");
	}

}

close_modal = () => {
	$(".cs-post-search-modal-post").remove();
	$("body").removeClass("hide-overflow");
}
function init(){
	$('html, body').animate({
				    scrollTop: $(".cs-blog-post-container").offset().top
	}, 0);
}

window.onload = init;
