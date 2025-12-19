





// 'use client';

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { AlertTriangle } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteSubTask } from '@/modules/project-management/task/slices/subTaskSlice';
// import { toast } from 'sonner';

// const DeleteSubtaskModal = ({onSubtaskDelete, open, setOpen, subtask, taskId }) => {
//   const dispatch = useDispatch();
//   const { loading: subTaskLoading, error: subTaskError } = useSelector((state) => state.subTask);

//   const confirmDelete = async () => {
//     try {
      
//       await dispatch(deleteSubTask({ taskId, subtaskId: subtask?.subtask_id ,subtaskHistory}));
//       toast.success('Subtask deleted successfully');
//       setOpen(false);
//       onSubtaskDelete()
//     } catch (err) {
//       toast.error(subTaskError || 'Failed to delete subtask');
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle className="flex items-center">
//             <AlertTriangle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
//             Delete Subtask
//           </DialogTitle>
//         </DialogHeader>
//         <p className="text-xs sm:text-sm">Are you sure you want to delete?</p>
//         {subTaskError && <p className="text-red-500 text-xs sm:text-sm">{subTaskError}</p>}
//         <div className="flex justify-end gap-2 mt-3">
//           <DialogClose asChild>
//             <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">
//               Cancel
//             </Button>
//           </DialogClose>
//           <Button
//             variant="destructive"
//             onClick={confirmDelete}
//             disabled={subTaskLoading}
//             className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm h-8 sm:h-9"
//           >
//             {subTaskLoading ? 'Deleting...' : 'Delete'}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DeleteSubtaskModal;





'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubTask } from '@/modules/project-management/task/slices/subTaskSlice';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const DeleteSubtaskModal = ({ onSubtaskDelete, open, setOpen, subtask, taskId }) => {
  const dispatch = useDispatch();
  const { currentUser } = useCurrentUser(); // ✅ Replaced Redux selector
  const { loading: subTaskLoading, error: subTaskError } = useSelector((state) => state.subTask);

  const confirmDelete = async () => {
    try {
      const payload = {
        taskId,
        subtaskId: subtask?.subtask_id,
        actionedBy: {
          note: 'Deleted subtask',
          performedBy: currentUser?.name || currentUser?.email || 'Unknown User',
          timestamp: new Date().toISOString(),
        },
      };

      const res = await dispatch(deleteSubTask(payload)).unwrap();

      toast.success(res?.message || 'Deleted successfully');
      setOpen(false);
      onSubtaskDelete?.();
    } catch (err) {
      toast.error(err?.message || err || 'Failed to delete subtask');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Subtask
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this subtask? This action cannot be undone.
        </p>

        {subTaskError && <p className="text-sm text-red-500">{subTaskError}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={subTaskLoading}
            size="sm"
          >
            {subTaskLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSubtaskModal;
