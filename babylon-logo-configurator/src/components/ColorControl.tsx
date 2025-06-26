import { Box, IconButton, Typography, Popover } from '@mui/material'
import { ChromePicker, type RGBColor } from 'react-color'
import type { ColorResult } from 'react-color'
import { useState } from 'react'
import styles from './ColorControl.module.css'

interface ColorControlProps {
  color: RGBColor
  label: string
  onChange: (color: RGBColor) => void
}

export function ColorControl({ color, label, onChange }: ColorControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColorChange = (colorResult: ColorResult) => {
    onChange(colorResult.rgb)
  }

  // Create a color object that includes alpha for the ChromePicker

  return (
    <Box className={styles.colorControl}>
      <IconButton
        onClick={handleClick}
        className={styles.colorButton}
        style={{
          backgroundColor: color ? `rgb(${color.r}, ${color.g}, ${color.b})` : '#fff',
          opacity: Math.max(0.1, color.a ?? 1),
        }}
      />
      <Typography variant="caption" color="text.secondary" className={styles.colorLabel}>
        {label}
      </Typography>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <ChromePicker color={color} onChange={handleColorChange} />
      </Popover>
    </Box>
  )
}
