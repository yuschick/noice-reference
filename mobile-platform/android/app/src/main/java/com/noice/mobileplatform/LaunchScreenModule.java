package com.noice.mobileplatform;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.noice.mobileplatform.R;

import android.app.Activity;
import android.app.Dialog;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import java.lang.ref.WeakReference;

public class LaunchScreenModule extends ReactContextBaseJavaModule {
	private static WeakReference<Activity> mainActivityRef;
	private static Dialog launchDialog;

	// RN Boilerplate
	@Override
	public String getName() {
		return "LaunchScreen";
	}
	LaunchScreenModule(ReactApplicationContext context) {
		super(context);
	}

	// Exposed Methods
	@ReactMethod
	public void hide() {
		Activity currentActivity = getCurrentActivity();

		if (currentActivity == null && mainActivityRef != null) {
			currentActivity = mainActivityRef.get();
		}

		if (currentActivity == null || launchDialog == null) {
			Log.d("LaunchScreen", "Launch screen doesn't have a ref to any activity, ignoring hide request.");
			return;
		}

		final Activity activity = currentActivity;
		activity.runOnUiThread(() -> {
			boolean isDestroyed = false;
			boolean isLaunchDialogShowing = launchDialog != null && launchDialog.isShowing();

			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
				isDestroyed = activity.isDestroyed();
			}

			if (!activity.isFinishing() && !isDestroyed && isLaunchDialogShowing) {
				Log.d("LaunchScreen", "Hiding launch screen");
				launchDialog.dismiss();
			}

			launchDialog = null;
		});
	}

	public static void show(@NonNull final Activity activity) {
		mainActivityRef = new WeakReference<Activity>(activity);

		activity.runOnUiThread(() -> {
			launchDialog = new Dialog(activity, R.style.AppTheme_LaunchDialog);
			launchDialog.setContentView(R.layout.launch_screen);
			launchDialog.setCancelable(false);

			if (!launchDialog.isShowing() && !activity.isFinishing()) {
				Log.d("LaunchScreen", "Showing launch screen");
				launchDialog.show();
			}
		});
	}
}
