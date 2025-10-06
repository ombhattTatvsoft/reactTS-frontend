import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { Box, IconButton, Typography } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { createInputField, createSelectDropdown } from '../../../common/utils/FormFieldGenerator';
import FieldRenderer from '../../../common/components/UI/FieldRenderer';
import type { ProjectPayload } from '../projectSchema';

interface MemberFieldsProps {
  roleOptions?: Array<{ value: string; label: string }>;
}

export const MemberFields: React.FC<MemberFieldsProps> = ({ 
  roleOptions = [
    { value: 'developer', label: 'Developer' },
    { value: 'manager', label: 'Manager' },
    { value: 'tester', label: 'Tester' },
  ]
}) => {
  const { values } = useFormikContext<ProjectPayload>();
  const members = values.members || [];

  return (
    <FieldArray name="members">
      {({ push, remove }) => (
        <Box className="w-full px-2">
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Team Members
            </Typography>
            <IconButton
              onClick={() => push({ email: '', role: 'developer' })}
              size="small"
              sx={{
                bgcolor: '#7c3aed',
                color: 'white',
                '&:hover': { bgcolor: '#6d28d9' },
                width: 36,
                height: 36,
              }}
            >
              <Add />
            </IconButton>
          </Box>

          {/* Empty State */}
          {members.length === 0 ? (
            <Box sx={{ 
              py: 4, 
              textAlign: 'center', 
              bgcolor: '#f9fafb',
              borderRadius: 2,
              border: '1px dashed #d1d5db',
              marginBottom:3,
            }}>
              <Typography variant="body2" color="text.secondary">
                No members added yet
              </Typography>
            </Box>
          ):
          <Box 
              sx={{ 
                bgcolor: '#fafafa',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                paddingTop:2,
                marginBottom:3,
              }}
            >
          {members.map((_: unknown, index: number) => (
            <Box sx={{display:"flex",gap:2,paddingX:2}} key={index}>
                {/* User Dropdown */}
              <Box sx={{ flex: 2 }}>
              <FieldRenderer field={createInputField({
                  type:"email",
                  name: `members.${index}.email`,
                  label: 'Email',
                  placeholder: "Enter member email",
                  containerclassname: 'w-full',
                })}/>
              </Box>

              {/* Role Dropdown */}
              <Box sx={{ flex: 1 }}>
              <FieldRenderer field={createSelectDropdown({
                  name: `members.${index}.role`,
                  label: 'Role',
                  options: roleOptions,
                  containerclassname: 'w-full',
                })}/>
              </Box>

              {/* Remove Button */}
              <Box>
              <IconButton
                onClick={() => remove(index)}
                size="small"
                sx={{
                  color: '#ef4444',
                  alignSelf: 'center',
                  marginTop:1.5,
                  '&:hover': { bgcolor: '#fee2e2' },
                }}
              >
                <Close />
              </IconButton>
              </Box>
            </Box>
          ))}
          </Box>
}
        </Box>
      )}
    </FieldArray>
  );
};