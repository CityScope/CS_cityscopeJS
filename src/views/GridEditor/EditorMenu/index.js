// // export default EditMenuMain;

import TypesEditor from './TypesEditor'
import GridProps from './GridProps'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

export default function EditorMenu() {
  return (
    <List>
      <ListItem>
        <Typography variant="h1">CityScope Grid Editor</Typography>
      </ListItem>
      <ListItem>
        <Typography>
          This tool is for creating CityScope projects with virtual editable
          girds, types, and props, and deploy them to cityIO.
        </Typography>
      </ListItem>
      <ListItem>
        <GridProps />
      </ListItem>
      <ListItem>
        <TypesEditor />
      </ListItem>
    </List>
  )
}
