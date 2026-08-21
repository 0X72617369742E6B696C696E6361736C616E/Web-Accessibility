<?php
/**
 * Remove plugin settings when the plugin is deleted from WordPress.
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'imu_web_accessibility_settings' );

