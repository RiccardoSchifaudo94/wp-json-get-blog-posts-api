<?php
/**
 * Plugin Name:  Blog Posts via API Rest WP_JSON
 * Description:  Fetch list of blog posts via wp_remote_get with a paginator
 * Plugin URI:   http://www.the-shinobi-arts-of-eccentricity.com/
 * Author:       Riccardo Schifaudo
 * Version:      1.0
 * Text Domain:  blogpostwithwpjsonapirest
 * License:      GPL v2 or later
 * License URI:  http://www.the-shinobi-arts-of-eccentricity.com/
 *
 * @package blogpostwithwpjsonapirest
 */




// Disable direct file access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get posts via REST API.
 */
function get_posts_via_rest() {

	$page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 1;
	// Initialize variable.
	$allposts = '<div class="cs-blog-post-loader hide"></div><div class="cs-blog-post-container">';
	
	$api_url_compose = 'https://brndwgn.com/wp-json/wp/v2/insight';

	$postsPerPage = 10;

	
	if($page!=1)
		
	$api_url_compose .= '?page='.$page.'&post_per_page='.$postsPerPage;
	

	$response = wp_remote_get( $api_url_compose );
	
	$totalPost = wp_remote_retrieve_header( $response, 'x-wp-total' );
	
	$numPages = ceil($totalPost/$postsPerPage);
		
	
	// Exit if error.
	if ( is_wp_error( $response ) ) {
		return;
	}

	// Get the body.
	$posts = json_decode( wp_remote_retrieve_body( $response ) );
	
	// Exit if nothing is returned.
	if ( empty( $posts ) ) {
		return;
		die();
	}

	// If there are posts.
	if ( ! empty( $posts ) ) {

		// For each post.
		foreach ( $posts as $post ) {

			// Use print_r($post); to get the details of the post and all available fields
			// Format the date.
			$fordate = date( 'd/m/Y', strtotime( $post->modified ) );

			// Show a linked title and post date.
			$allposts .= '<div class="cs-blog-post"><a href="' . esc_url( $post->link ) . '" target=\"_blank\"><h1>' . esc_html( $post->title->rendered ) . '</h1><strong>'.esc_html($fordate).'</strong><img src="'.esc_html( $post->acf->banner_image__desktop->sizes->large).'"></a>' . $post->excerpt->rendered. '<a href="' . esc_url( $post->link ) . '" target=\"_blank\"><button>Read More</button></a></div>'	;
		
		}
		

		$allposts .= create_pagination($numPages,$page).'</div>';
		
		//return $allposts;
		echo $allposts;
	}

}

function create_pagination($numPages,$currentPage = 1)
{
	$paginator = '<div class="paginator_container"><ul>';
	for ($i=1;$i<=$numPages;$i++) {
		
		$classActive = '';

		($currentPage==$i) ? $classActive = 'active' : $classActive = ''; 
	 
     	 $paginator .= '<li class="square '.$classActive.'" id='.$i.' onclick="pagination('.$i.')"> '.$i.'</li>';
	
	}
	
	$paginator .= '</ul></div>';
	return $paginator;
}
// Register as a shortcode to be used on the site.
add_shortcode( 'sc_get_posts_via_rest', 'get_posts_via_rest' );

wp_enqueue_script('jquery');

wp_register_script ( 'cs-post-js', plugins_url ( 'js/app.js', __FILE__ ) );
wp_register_style ( 'cs-post-css', plugins_url ( 'css/style.css', __FILE__ ));
wp_enqueue_script('cs-post-js');
wp_enqueue_style('cs-post-css');

add_action( 'wp_ajax_get_posts_via_rest', 'get_posts_via_rest' );
add_action( 'wp_ajax_nopriv_get_posts_via_rest', 'get_posts_via_rest' );

function my_vars_js(){ 
?>
      <script type="text/javascript">
        var ajaxurl = '<?php echo admin_url( "admin-ajax.php" ); ?>';
      </script>
<?php
}
add_action ( 'wp_head', 'my_vars_js' );