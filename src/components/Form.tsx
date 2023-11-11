import {
  SortOptions,
  TimeOptions,
  sortOptions,
  timeOptions,
} from '@/types/reddit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  subreddit: z.string(),
});

export default function SearchBar() {
  const router = useRouter();

  const currentSubreddit = (router.query.slug?.[0] as string) ?? 'earthporn';
  const currentSort = (router.query.slug?.[1] as SortOptions) ?? 'hot';
  const currentTime = (router.query.t as TimeOptions) ?? 'day';

  console.log(currentSort, currentTime);

  const [sort, setSort] = useState<SortOptions>(currentSort);
  const [time, setTime] = useState<TimeOptions>(currentTime);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (sort === 'top') {
      router.push(
        `/r/${values.subreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
      );
    } else {
      router.push(`/r/${values.subreddit}`);
    }
  }

  function onSortChange(sort: SortOptions) {
    setSort(sort);
    if (sort === 'top') {
      router.push(
        `/r/${currentSubreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
      );
    } else {
      router.push(`/r/${currentSubreddit}/${sort.toLowerCase()}`);
    }
  }

  function onTimeChange(time: TimeOptions) {
    setTime(time);
    router.push(
      `/r/${currentSubreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
    );
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex items-center gap-2'
        >
          <div className='grow'>
            <FormField
              control={form.control}
              name='subreddit'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='bg-black'
                      aria-label='Subreddit name'
                      placeholder='Enter a subreddit name'
                      type='search'
                      required
                      aria-describedby={undefined}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button className='w-24' type='submit'>
            Submit
          </Button>
        </form>
      </Form>

      <div className='flex items-center justify-between gap-2'>
        <h2 className='truncate text-xl font-semibold sm:text-3xl'>
          <a
            className='hover:underline'
            target='_blank'
            href={`https://www.reddit.com/r/${currentSubreddit}`}
          >
            r/{currentSubreddit}
          </a>{' '}
        </h2>

        <div className='flex gap-2'>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className='w-24 bg-black' defaultValue='hot'>
              <SelectValue placeholder='Sort' />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {sort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {sort === 'top' && (
            <Select value={time} onValueChange={onTimeChange}>
              <SelectTrigger className='w-24 bg-black'>
                <SelectValue placeholder='Time' />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
