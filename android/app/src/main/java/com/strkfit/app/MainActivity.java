package com.strkfit.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import eu.greenstem.aktivan.pedometer.PedometerPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PedometerPlugin.class);
        super.onCreate(savedInstanceState);
    }
}