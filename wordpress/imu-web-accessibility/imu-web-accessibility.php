<?php
/**
 * Plugin Name: İMÜ Web Erişilebilirlik
 * Plugin URI:  https://www.medeniyet.edu.tr/
 * Description: Web sitesine erişilebilirlik tercih araçları ve klavye ile erişilebilen bir yan panel ekler.
 * Version:     1.0.17
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author:      İstanbul Medeniyet Üniversitesi
 * License:     GPL-2.0-or-later
 * Text Domain: imu-web-accessibility
 */

defined( 'ABSPATH' ) || exit;

define( 'IMU_WA_VERSION', '1.0.17' );
define( 'IMU_WA_OPTION', 'imu_web_accessibility_settings' );

/**
 * Return validated plugin settings with defaults.
 *
 * @return array{position:string,csp_mode:int}
 */
function imu_wa_get_settings() {
	$defaults = array(
		'position' => 'bottom-left',
		'csp_mode' => 0,
	);

	$settings = get_option( IMU_WA_OPTION, array() );
	return wp_parse_args( is_array( $settings ) ? $settings : array(), $defaults );
}

/**
 * Sanitize settings before saving.
 *
 * @param mixed $input Submitted settings.
 * @return array{position:string,csp_mode:int}
 */
function imu_wa_sanitize_settings( $input ) {
	$input   = is_array( $input ) ? $input : array();
	$allowed = array( 'bottom-left', 'bottom-right' );
	$position = isset( $input['position'] ) ? sanitize_key( $input['position'] ) : 'bottom-left';

	return array(
		'position' => in_array( $position, $allowed, true ) ? $position : 'bottom-left',
		'csp_mode' => empty( $input['csp_mode'] ) ? 0 : 1,
	);
}

/**
 * Enqueue the correct frontend bundle.
 */
function imu_wa_enqueue_assets() {
	$settings  = imu_wa_get_settings();
	$csp_mode  = ! empty( $settings['csp_mode'] );
	$file_name = $csp_mode ? 'web-accessibility.csp.min.js' : 'web-accessibility.min.js';
	$file_path = plugin_dir_path( __FILE__ ) . 'assets/' . $file_name;
	$version   = file_exists( $file_path ) ? (string) filemtime( $file_path ) : IMU_WA_VERSION;

	wp_enqueue_script(
		'imu-web-accessibility',
		plugin_dir_url( __FILE__ ) . 'assets/' . $file_name,
		array(),
		$version,
		true
	);

	if ( function_exists( 'wp_script_add_data' ) ) {
		wp_script_add_data( 'imu-web-accessibility', 'strategy', 'defer' );
	}
}
add_action( 'wp_enqueue_scripts', 'imu_wa_enqueue_assets' );

/**
 * Add widget configuration attributes to its script element.
 *
 * @param string $tag    Script HTML.
 * @param string $handle Registered script handle.
 * @return string
 */
function imu_wa_add_script_attributes( $tag, $handle ) {
	if ( 'imu-web-accessibility' !== $handle ) {
		return $tag;
	}

	$settings   = imu_wa_get_settings();
	$attributes = sprintf(
		' data-language="tr" data-position="%s"',
		esc_attr( $settings['position'] )
	);

	if ( ! empty( $settings['csp_mode'] ) ) {
		$css_url = add_query_arg(
			'ver',
			IMU_WA_VERSION,
			plugin_dir_url( __FILE__ ) . 'assets/web-accessibility.css'
		);
		$attributes .= sprintf(
			' data-wa-css="%s"',
			esc_url( $css_url )
		);
	}

	if ( ! preg_match( '/\sdefer(?:\s|=|>)/i', $tag ) ) {
		$attributes .= ' defer';
	}

	$updated = preg_replace( '/<script\b/i', '<script' . $attributes, $tag, 1 );
	return is_string( $updated ) ? $updated : $tag;
}
add_filter( 'script_loader_tag', 'imu_wa_add_script_attributes', 10, 2 );

/**
 * Register plugin settings.
 */
function imu_wa_register_settings() {
	register_setting(
		'imu_web_accessibility',
		IMU_WA_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'imu_wa_sanitize_settings',
			'default'           => array(
				'position' => 'bottom-left',
				'csp_mode' => 0,
			),
		)
	);
}
add_action( 'admin_init', 'imu_wa_register_settings' );

/**
 * Add the settings screen under WordPress Settings.
 */
function imu_wa_add_settings_page() {
	add_options_page(
		__( 'Web Erişilebilirlik', 'imu-web-accessibility' ),
		__( 'Web Erişilebilirlik', 'imu-web-accessibility' ),
		'manage_options',
		'imu-web-accessibility',
		'imu_wa_render_settings_page'
	);
}
add_action( 'admin_menu', 'imu_wa_add_settings_page' );

/**
 * Render the settings screen.
 */
function imu_wa_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$settings = imu_wa_get_settings();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'İMÜ Web Erişilebilirlik', 'imu-web-accessibility' ); ?></h1>
		<p><?php esc_html_e( 'Erişilebilirlik düğmesinin konumunu ve paket yükleme yöntemini belirleyin.', 'imu-web-accessibility' ); ?></p>

		<form action="options.php" method="post">
			<?php settings_fields( 'imu_web_accessibility' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="imu-wa-position"><?php esc_html_e( 'Düğme konumu', 'imu-web-accessibility' ); ?></label>
					</th>
					<td>
						<select id="imu-wa-position" name="<?php echo esc_attr( IMU_WA_OPTION ); ?>[position]">
							<option value="bottom-left" <?php selected( $settings['position'], 'bottom-left' ); ?>><?php esc_html_e( 'Sol alt', 'imu-web-accessibility' ); ?></option>
							<option value="bottom-right" <?php selected( $settings['position'], 'bottom-right' ); ?>><?php esc_html_e( 'Sağ alt', 'imu-web-accessibility' ); ?></option>
						</select>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Güvenlik modu', 'imu-web-accessibility' ); ?></th>
					<td>
						<label for="imu-wa-csp-mode">
							<input
								id="imu-wa-csp-mode"
								name="<?php echo esc_attr( IMU_WA_OPTION ); ?>[csp_mode]"
								type="checkbox"
								value="1"
								<?php checked( ! empty( $settings['csp_mode'] ) ); ?>
							/>
							<?php esc_html_e( 'Sıkı Content Security Policy (CSP) paketini kullan', 'imu-web-accessibility' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Siteniz inline stil veya data: font kullanımını engelliyorsa etkinleştirin.', 'imu-web-accessibility' ); ?>
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

/**
 * Add a direct settings link on the Plugins screen.
 *
 * @param string[] $links Existing action links.
 * @return string[]
 */
function imu_wa_plugin_action_links( $links ) {
	$url = admin_url( 'options-general.php?page=imu-web-accessibility' );
	array_unshift(
		$links,
		sprintf(
			'<a href="%s">%s</a>',
			esc_url( $url ),
			esc_html__( 'Ayarlar', 'imu-web-accessibility' )
		)
	);
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'imu_wa_plugin_action_links' );
