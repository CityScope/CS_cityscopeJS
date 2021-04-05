import { Typography, Link, Card, CardContent } from '@material-ui/core'

export default function SelectedTable(props) {
  const clicked = props.clicked
  const cityscopeJSendpoint =
    'https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope='

  return (
    <Card
      elevation={15}
      style={{
        position: 'relative',
        zIndex: 100,
      }}
    >
      <CardContent>
        <Typography variant="h2" color="textPrimary">
          CityScope {clicked.object.info.tableName}
        </Typography>
        <Typography>
          <Link
            color={'secondary'}
            href={
              cityscopeJSendpoint + clicked.object.info.tableName.toLowerCase()
            }
          >
            Go to project
          </Link>{' '}
          or{' '}
          <Link
            target={'blank'}
            color={'secondary'}
            href={clicked.object.table}
          >
            view raw data on cityIO.
          </Link>
        </Typography>
      </CardContent>
    </Card>
  )
}
