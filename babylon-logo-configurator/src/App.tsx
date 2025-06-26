import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Paper, FormControl, FormLabel, Slider, Typography, Stack, Divider } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { BabylonDemo } from './babylon/BabylonDemo.js'
import { ColorControl } from './components/ColorControl.js'
import type { RGBColor } from 'react-color'
import {
  BASE_COLOR,
  INIT_GLOW_INTENSITY,
  INIT_SPIN_SPEED,
  INNER_ORBIT_COLOR,
  OUTER_ORBIT_COLOR,
} from './babylon/BabylonDemoConstants.js'

function App() {
  const bjsCanvas = useRef<HTMLCanvasElement>(null)
  const bjsDemo = useRef<BabylonDemo>(null)

  // Form state
  const [color1, setColor1] = useState<RGBColor>(BASE_COLOR)
  const [color2, setColor2] = useState<RGBColor>(OUTER_ORBIT_COLOR)
  const [color3, setColor3] = useState<RGBColor>(INNER_ORBIT_COLOR)
  const [spinSpeed, setSpinSpeed] = useState(INIT_SPIN_SPEED)
  const [glowIntensity, setGlowIntensity] = useState(INIT_GLOW_INTENSITY)

  // Handler method for color changes
  const handleColorChange = (color: RGBColor, controlId: string) => {
    // Update the corresponding state
    switch (controlId) {
      case 'color1':
        setColor1(color)
        break
      case 'color2':
        setColor2(color)
        break
      case 'color3':
        setColor3(color)
        break
      default:
        console.warn(`Unknown color control ID: ${controlId}`)
        return
    }
    // If you need to update the Babylon.js scene, you can access it here:
    if (bjsDemo.current) {
      bjsDemo.current.updateMaterialColor(controlId, color)
    }
  }

  useEffect(() => {
    if (!bjsCanvas.current) {
      return
    }
    if (!bjsDemo.current) {
      bjsDemo.current = new BabylonDemo(bjsCanvas.current)
      bjsDemo.current.init(INIT_SPIN_SPEED, INIT_GLOW_INTENSITY)
    }

    return () => {
      // Cleanup Babylon.js resources when the component unmounts
      // Can be tricky to dispose properly in a react app with STRICT mode. Only necessary
      // in more complicated use cases.
      // if (bjsDemo.current) {
      //   bjsDemo.current.dispose()
      //   bjsDemo.current = null
      // }
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <Box className="app-container">
        {/* Viewer Panel - Left */}
        <Box className="viewer-panel">
          <canvas id="bjsCanvas" ref={bjsCanvas}></canvas>
        </Box>

        {/* Configuration Panel - Right */}
        <Paper elevation={3} className="config-panel">
          <Typography variant="h6" className="config-title">
            Logo Configurator
          </Typography>

          <Stack spacing={2}>
            {/* Color Controls */}
            <FormControl>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Colors</FormLabel>
              <Box className="color-controls">
                <ColorControl color={color1} label="Color 1" onChange={(color) => handleColorChange(color, 'color1')} />
                <ColorControl color={color2} label="Color 2" onChange={(color) => handleColorChange(color, 'color2')} />
                <ColorControl color={color3} label="Color 3" onChange={(color) => handleColorChange(color, 'color3')} />
              </Box>
            </FormControl>

            <Divider />

            {/* Slider Controls */}
            <FormControl>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Spin Speed: {spinSpeed}</FormLabel>
              <Slider
                value={spinSpeed}
                onChange={(_, value) => {
                  bjsDemo.current?.updateSpinSpeed(value)
                  setSpinSpeed(value as number)
                }}
                min={0}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Glow Intensity: {glowIntensity}</FormLabel>
              <Slider
                value={glowIntensity}
                onChange={(_, value) => {
                  bjsDemo.current?.updateGlowLayerIntensity(value)
                  setGlowIntensity(value as number)
                }}
                min={0}
                max={3}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </FormControl>
          </Stack>
        </Paper>
      </Box>
    </>
  )
}

export default App
