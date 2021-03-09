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
		   		$(".cs-blog-post-container").html(result);
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

function init(){
	$('html, body').animate({
				    scrollTop: $(".cs-blog-post-container").offset().top
	}, 0);
}

window.onload = init;
