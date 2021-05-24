import { Typography, Box } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'

const LoadingSpinner = (props) => {
  const { loadingModules } = props

  return (
    <>
      {loadingModules.map((module, index) => {
        return (
          <Box
            position="fixed"
            bottom={index * 50}
            right="2vw"
            width="10vw"
            zIndex="101"
            margin="0"
            key={module}
          >
            <LinearProgress color={'secondary'} />
            <Typography
              variant="caption"
              color="primary"
              style={{ marginRight: '10px' }}
            >
              {module}
            </Typography>
          </Box>
        )
      })}
    </>
  )
}

export default LoadingSpinner
