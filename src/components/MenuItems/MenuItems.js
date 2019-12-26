import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { Link } from 'react-router-dom';
import I18n from "@aws-amplify/core/lib/I18n";

export const mainListItems = (
  <div>
    <Link to='/'>
      <ListItem button>
        <ListItemIcon>
          <PostAddIcon />
        </ListItemIcon>
        <ListItemText primary={I18n.get("Drafts")} />
      </ListItem>
    </Link>
    <Link to='/'>
      <ListItem button>
        <ListItemIcon>
          <ScheduleIcon />
        </ListItemIcon>
        <ListItemText primary={I18n.get("Pending")} />
      </ListItem>
    </Link>
    <ListItem button>
      <ListItemIcon>
        <ThumbUpIcon /> 
      </ListItemIcon>
      <ListItemText primary={I18n.get("Published")} />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ThumbDownIcon />
      </ListItemIcon>
      <ListItemText primary={I18n.get("Rejected")}/>
    </ListItem>
  </div>
);