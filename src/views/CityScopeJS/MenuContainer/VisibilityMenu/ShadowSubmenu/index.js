import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'

const ShadowSubmenu = () => {
  const handleSlider = (e, newValue) => {
    // setSlider(newValue)
  }

  const marks = [
    {
      value: 0,
      label: '12AM',
    },
    {
      value: 21600,
      label: '6AM',
    },
    {
      value: 43200,
      label: '12PM',
    },
    {
      value: 64800,
      label: '6PM',
    },
    {
      value: 86400,
      label: '12AM',
    },
  ]

  return (
    <>
      <Typography variant="subtitle2" id="range-slider" gutterBottom>
        Time of day
      </Typography>
      <Slider
        min={0}
        max={86400}
        marks={marks}
        // value={sliders.time}
        onChange={handleSlider}
        valueLabelDisplay="off"
        aria-labelledby="range-slider"
      />
    </>
  )
}

export default ShadowSubmenu
